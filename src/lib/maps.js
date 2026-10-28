// Googleマップで、名前と住所から探すリンク（電話番号は、Googleマップのページで見られる）
export const mapsUrl = (h) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${h.name} ${h.address}`)}`;
