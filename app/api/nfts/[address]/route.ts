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

    // Zerion NFTs for a wallet: filter by references (owner address)
    let url = `https://api.zerion.io/v1/nfts/?currency=usd&filter[references]=${address}&page[size]=${Math.min(
      Math.max(limit, 1),
      50
    )}`;

    let response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${Buffer.from(zerionApiKey + ':').toString('base64')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // Retry with alternate parameter name used by some Zerion docs
      url = `https://api.zerion.io/v1/nfts/?currency=usd&filter[owner_addresses]=${address}&page[size]=${Math.min(
        Math.max(limit, 1),
        50
      )}`;
      response = await fetch(url, {
        headers: {
          'Authorization': `Basic ${Buffer.from(zerionApiKey + ':').toString('base64')}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return NextResponse.json(
          { error: errorData.error || 'Failed to fetch NFTs', details: errorData },
          { status: response.status }
        );
      }
    }

    const data = await response.json();
    const items = Array.isArray(data?.data) ? data.data : [];

    const nfts = items.map((item: any) => {
      const a = item.attributes || {};
      const collection = a.collection || {};
      return {
        id: item.id,
        name: a.name || a.title || 'NFT',
        description: a.description || '',
        image_url: a.image_url || a.image || '',
        collection_name: collection?.name || 'Unknown',
        token_id: a.token_id || a.tokenId || '',
        contract_address: a.asset_contract || a.contract_address || '',
        floor_price_usd: a.floor_price_usd || 0,
        last_sale_price_usd: a.last_sale_price_usd || 0,
        rarity_rank: a.rarity_rank || null,
        traits: Array.isArray(a.traits)
          ? a.traits.map((t: any) => ({ trait_type: t.trait_type || t.type, value: t.value }))
          : [],
        chain_id: a.chain || a.network || 'ethereum',
      };
    });

    return NextResponse.json({ nfts, pagination: data?.links || {} });

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