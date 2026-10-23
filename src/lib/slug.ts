const MAP: Record<string, string> = { č: "c", ć: "c", š: "s", ž: "z", đ: "dj" };

/** "Šta je `interface`?" → "sta-je-interface" (za #sidra u lekciji). */
export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[čćšžđ]/g, (c) => MAP[c])
    .replace(/[`*_]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
