import { NextRequest, NextResponse } from 'next/server'

// Amadeus hotel search API endpoint
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cityCode = searchParams.get('cityCode') || 'NYC' // Default to New York
    const checkInDate = searchParams.get('checkInDate') || '2025-08-15'
    const checkOutDate = searchParams.get('checkOutDate') || '2025-08-17'
    const adults = searchParams.get('adults') || '2'
    const radius = searchParams.get('radius') || '50' // Increased radius to 50km
    const radiusUnit = searchParams.get('radiusUnit') || 'KM'
    const hotelSource = searchParams.get('hotelSource') || 'ALL'

    // Get OAuth token first
    const tokenResponse = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.AMADEUS_CLIENT_ID!,
        client_secret: process.env.AMADEUS_CLIENT_SECRET!,
      }),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      return NextResponse.json({ 
        error: 'Failed to get OAuth token', 
        status: tokenResponse.status,
        details: errorText 
      }, { status: 400 })
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Step 1: Search for hotels by city using the correct endpoint
    const hotelSearchUrl = new URL('https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city')
    hotelSearchUrl.searchParams.append('cityCode', cityCode)
    hotelSearchUrl.searchParams.append('radius', radius)
    hotelSearchUrl.searchParams.append('radiusUnit', radiusUnit)
    hotelSearchUrl.searchParams.append('hotelSource', hotelSource)
    // Request more hotels in the first step - removed pagination as it may not be supported

    const hotelListResponse = await fetch(hotelSearchUrl.toString(), {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })

    if (!hotelListResponse.ok) {
      const errorText = await hotelListResponse.text()
      return NextResponse.json({ 
        error: 'Hotel list search failed',
        status: hotelListResponse.status,
        details: errorText 
      }, { status: 400 })
    }

    const hotelListData = await hotelListResponse.json()
    
    console.log(`Found ${hotelListData.data?.length || 0} hotels in step 1 for city ${cityCode}`)
    
    if (!hotelListData.data || hotelListData.data.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        meta: {
          count: 0,
          cityCode,
          message: 'No hotels found in this city'
        }
      })
    }

    // Step 2: Get hotel offers for first 30 hotels to increase chances of getting offers
    const maxHotelsToQuery = Math.min(30, hotelListData.data.length)
    const hotelIds = hotelListData.data.slice(0, maxHotelsToQuery).map((hotel: any) => hotel.hotelId).join(',')
    
    const hotelOffersUrl = new URL('https://test.api.amadeus.com/v3/shopping/hotel-offers')
    hotelOffersUrl.searchParams.append('hotelIds', hotelIds)
    hotelOffersUrl.searchParams.append('checkInDate', checkInDate)
    hotelOffersUrl.searchParams.append('checkOutDate', checkOutDate)
    hotelOffersUrl.searchParams.append('roomQuantity', '1')
    hotelOffersUrl.searchParams.append('adults', adults)
    hotelOffersUrl.searchParams.append('currency', 'USD')

    const hotelResponse = await fetch(hotelOffersUrl.toString(), {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })

    if (!hotelResponse.ok) {
      const errorText = await hotelResponse.text()
      return NextResponse.json({ 
        error: 'Hotel search failed',
        status: hotelResponse.status,
        details: errorText 
      }, { status: 400 })
    }

    const hotelData = await hotelResponse.json()
    
    console.log(`Found ${hotelData.data?.length || 0} hotels with offers in step 2`)

    // Transform data to match our TStayListing interface
    const transformedHotels = hotelData.data?.map((hotelOffer: any) => {
      const hotelInfo = hotelOffer.hotel
      const offers = hotelOffer.offers || []
      const lowestPriceOffer = offers.length > 0 ? offers.reduce((lowest: any, current: any) => {
        const currentPrice = parseFloat(current.price?.total || '999999')
        const lowestPrice = parseFloat(lowest.price?.total || '999999')
        return currentPrice < lowestPrice ? current : lowest
      }, offers[0]) : null

      // Generate a realistic image URL (using Pexels hotel images)
      const hotelImages = [
        'https://images.pexels.com/photos/6129967/pexels-photo-6129967.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
        'https://images.pexels.com/photos/261394/pexels-photo-261394.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        'https://images.pexels.com/photos/2861361/pexels-photo-2861361.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        'https://images.pexels.com/photos/6969831/pexels-photo-6969831.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        'https://images.pexels.com/photos/6527036/pexels-photo-6527036.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        'https://images.pexels.com/photos/1320686/pexels-photo-1320686.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        'https://images.pexels.com/photos/2677398/pexels-photo-2677398.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        'https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
      ]
      
      const randomImageIndex = Math.floor(Math.random() * hotelImages.length)
      const featuredImage = hotelImages[randomImageIndex]
      
      // Create gallery with 4 different images
      const galleryImgs = Array.from({ length: 4 }, (_, index) => 
        hotelImages[(randomImageIndex + index) % hotelImages.length]
      )

      return {
        id: `amadeus-hotel://${hotelInfo.hotelId}`,
        date: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        listingCategory: 'Hotel',
        title: hotelInfo.name || 'Hotel',
        handle: hotelInfo.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `hotel-${hotelInfo.hotelId}`,
        description: hotelInfo.description || 'Located in New York City',
        featuredImage,
        galleryImgs,
        like: Math.random() > 0.7, // Random like status
        address: hotelInfo.address?.lines?.join(', ') || 'New York, NY',
        reviewStart: Math.round((Math.random() * 2 + 3) * 10) / 10, // Random rating 3.0-5.0
        reviewCount: Math.floor(Math.random() * 500 + 20), // Random review count 20-520
        price: lowestPriceOffer?.price?.total ? `$${Math.round(parseFloat(lowestPriceOffer.price.total))}` : '$200',
        maxGuests: lowestPriceOffer?.guests?.adults || 2,
        bedrooms: Math.floor(Math.random() * 3 + 1), // Random 1-3 bedrooms
        bathrooms: Math.floor(Math.random() * 2 + 1), // Random 1-2 bathrooms
        beds: Math.floor(Math.random() * 2 + 1), // Random 1-2 beds
        saleOff: Math.random() > 0.8 ? `-${Math.floor(Math.random() * 20 + 5)}% today` : null,
        isAds: null,
        map: hotelInfo.geoCode ? {
          lat: parseFloat(hotelInfo.geoCode.latitude),
          lng: parseFloat(hotelInfo.geoCode.longitude)
        } : { lat: 40.7128, lng: -74.0060 }, // Default NYC coordinates
      }
    }) || []

    // If we have fewer than 8 hotels with offers, add some from the hotel list as mock data
    if (transformedHotels.length < 8 && hotelListData.data.length > transformedHotels.length) {
      const existingHotelIds = new Set(transformedHotels.map((h: any) => h.id.split('://')[1]))
      const additionalHotels = hotelListData.data
        .filter((hotel: any) => !existingHotelIds.has(hotel.hotelId))
        .slice(0, 8 - transformedHotels.length)
        .map((hotel: any) => {
          // Create mock hotel data from hotel list without offers
          const hotelImages = [
            'https://images.pexels.com/photos/6129967/pexels-photo-6129967.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
            'https://images.pexels.com/photos/261394/pexels-photo-261394.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
            'https://images.pexels.com/photos/2861361/pexels-photo-2861361.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
            'https://images.pexels.com/photos/6969831/pexels-photo-6969831.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
            'https://images.pexels.com/photos/6527036/pexels-photo-6527036.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
            'https://images.pexels.com/photos/1320686/pexels-photo-1320686.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
            'https://images.pexels.com/photos/2677398/pexels-photo-2677398.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
            'https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
          ]
          
          const randomImageIndex = Math.floor(Math.random() * hotelImages.length)
          const featuredImage = hotelImages[randomImageIndex]
          const galleryImgs = Array.from({ length: 4 }, (_, index) => 
            hotelImages[(randomImageIndex + index) % hotelImages.length]
          )

          return {
            id: `amadeus-hotel://${hotel.hotelId}`,
            date: new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }),
            listingCategory: 'Hotel',
            title: hotel.name || 'Hotel',
            handle: hotel.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `hotel-${hotel.hotelId}`,
            description: 'Located in New York City',
            featuredImage,
            galleryImgs,
            like: Math.random() > 0.7,
            address: hotel.address?.lines?.join(', ') || 'New York, NY',
            reviewStart: Math.round((Math.random() * 2 + 3) * 10) / 10,
            reviewCount: Math.floor(Math.random() * 500 + 20),
            price: `$${Math.floor(Math.random() * 400 + 200)}`, // Random price $200-600
            maxGuests: Math.floor(Math.random() * 3 + 2), // 2-4 guests
            bedrooms: Math.floor(Math.random() * 3 + 1),
            bathrooms: Math.floor(Math.random() * 2 + 1),
            beds: Math.floor(Math.random() * 2 + 1),
            saleOff: Math.random() > 0.8 ? `-${Math.floor(Math.random() * 20 + 5)}% today` : null,
            isAds: null,
            map: hotel.geoCode ? {
              lat: parseFloat(hotel.geoCode.latitude),
              lng: parseFloat(hotel.geoCode.longitude)
            } : { lat: 40.7128, lng: -74.0060 },
          }
        })
      
      transformedHotels.push(...additionalHotels)
    }

    return NextResponse.json({
      success: true,
      data: transformedHotels,
      meta: {
        count: transformedHotels.length,
        cityCode,
        checkInDate,
        checkOutDate,
        adults,
        hotelsFound: hotelListData.data?.length || 0,
        hotelsWithOffers: hotelData.data?.length || 0
      },
      raw: hotelData.meta || null, // Include original meta for debugging
    })
  } catch (error) {
    console.error('Hotel search error:', error)
    return NextResponse.json({
      error: 'Hotel search failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}