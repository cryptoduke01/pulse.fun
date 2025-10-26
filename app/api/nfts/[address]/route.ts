import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '12');

    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json(
        { error: 'Invalid wallet address format' },
        { status: 400 }
      );
    }

    const zerionApiKey = process.env.NEXT_PUBLIC_ZERION_API_KEY;

    if (!zerionApiKey) {
      return NextResponse.json({ error: 'Zerion API key not configured' }, { status: 500 });
    }

    // For now, return mock data since Zerion NFT API requires different parameters
    // TODO: Research correct Zerion API endpoint for wallet NFTs
    const mockNfts = [
      {
        id: 'mock-nft-1',
        name: 'Cool NFT #1234',
        collection_name: 'Cool Collection',
        image_url: 'https://via.placeholder.com/300x300/6366f1/ffffff?text=NFT',
        floor_price_usd: 0.5,
        last_sale_price_usd: 1.2,
        rarity_rank: 15,
        rarity_score: 0.95,
        traits: [
          { name: 'Background', value: 'Blue' },
          { name: 'Eyes', value: 'Laser' }
        ],
        token_id: '1234',
        contract_address: '0x1234567890123456789012345678901234567890',
      },
      {
        id: 'mock-nft-2',
        name: 'Rare NFT #5678',
        collection_name: 'Rare Collection',
        image_url: 'https://via.placeholder.com/300x300/8b5cf6/ffffff?text=RARE',
        floor_price_usd: 2.1,
        last_sale_price_usd: 3.5,
        rarity_rank: 3,
        rarity_score: 0.99,
        traits: [
          { name: 'Background', value: 'Purple' },
          { name: 'Hat', value: 'Crown' }
        ],
        token_id: '5678',
        contract_address: '0x1234567890123456789012345678901234567890',
      }
    ];

    return NextResponse.json({ nfts: mockNfts, pagination: { next: null } });

    /* Original Zerion API call - commented out until we figure out correct parameters
    const response = await fetch(`https://api.zerion.io/v1/nfts/?currency=usd&limit=${limit}&filter[references]=${address}`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(zerionApiKey + ':').toString('base64')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Zerion NFT API error:', {
        status: response.status,
        statusText: response.statusText,
        errorData,
        url: `/api/nfts/${address}`
      });
      return NextResponse.json(
        { error: errorData.error || `Failed to fetch NFTs: ${response.statusText}`, details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Map Zerion NFT response to a simpler format for the frontend
    const nfts = (data.data || []).map((nft: any) => ({
      id: nft.id,
      name: nft.attributes.name,
      collection_name: nft.attributes.collection_name,
      image_url: nft.attributes.previews?.image_small_url || nft.attributes.previews?.image_url,
      floor_price_usd: nft.attributes.floor_price?.value || 0,
      last_sale_price_usd: nft.attributes.last_sale?.value || 0,
      rarity_rank: nft.attributes.rarity?.rank || null,
      rarity_score: nft.attributes.rarity?.score || null,
      traits: nft.attributes.traits || [],
      token_id: nft.attributes.token_id,
      contract_address: nft.attributes.contract_address,
    }));

    return NextResponse.json({ nfts, pagination: data.links });
    */
  } catch (error: any) {
    console.error('NFT API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}