export interface GameItem {
  id: string;
  name: string;
  url: string;
  provider: string;
  categories?: string[];
  image?: string;
  addedOrder: number;
}

export const GAME_PROVIDERS = [
  { id: 'gn-math', name: 'GN-Math' },
  { id: 'truffled', name: 'Truffled.lol' },
  { id: 'petezah', name: 'PeteZah' },
  { id: 'elite', name: 'Elite Gamez' },
  { id: 'sea-bean', name: 'Sea Bean' },
  { id: 'ugs', name: 'UGS (Page may lag)' },
  { id: 'blox', name: 'Bloxcraft UBG' },
  { id: 'seraph', name: 'Seraph' },
];

export const TRUFFLED_PROXIES = [
  { url: 'https://truffled.lol', name: 'truffled.lol (Default)' },
  { url: 'https://classlink.com.de', name: 'classlink.com.de' },
  { url: 'https://pamson.pl.sophiemaslowski.com', name: 'pamson.pl.sophiemaslowski.com' },
  { url: 'https://lightspeed-sucks.9ibee.com', name: 'lightspeed-sucks.9ibee.com' },
];

export const GAME_CATEGORIES = [
  'Action', 'Racing', 'Strategy', 'Sports', 'Skill', 'Shooting', '2 Player', 'Io'
];

export async function fetchGames(provider: string, proxy?: string): Promise<GameItem[]> {
  try {
    if (provider === 'blox') {
      const response = await fetch('https://cdn.jsdelivr.net/gh/tharun9772/tharun9772.github.io/games/games.json');
      const data = await response.json();
      return data.map((g: any, index: number) => {
        let cleanedUrl = g.url.replace('/app-viewer/?view=/', '/');
        if (!cleanedUrl.endsWith('index.html')) {
          cleanedUrl = cleanedUrl.replace(/\/?$/, '/') + 'index.html';
        }
        return {
          id: `blox-${index}`,
          provider: 'blox',
          name: g.name,
          url: cleanedUrl.startsWith('http') ? cleanedUrl : "https://cdn.jsdelivr.net/gh/tharun9772/tharun9772.github.io@main/" + cleanedUrl.replace(/^\//, ''),
          image: g.img ? (g.img.startsWith('http') ? g.img : "https://cdn.jsdelivr.net/gh/tharun9772/tharun9772.github.io@main/" + g.img.replace(/^\//, '')) : undefined,
          addedOrder: index
        };
      });
    }

    if (provider === 'gn-math') {
      const response = await fetch("https://cdn.jsdelivr.net/gh/freebuisness/assets/zones.json");
      const rawZones = await response.json();
      return rawZones.filter((g: any) => g.id !== -1 && !g.name.startsWith("[!]")).map((z: any, index: number) => {
        let coverUrl = (z.cover || "").replace('{COVER_URL}', '');
        if(coverUrl.startsWith('/')) coverUrl = coverUrl.substring(1);
        return {
          id: `gn-${index}`,
          provider: 'gn-math',
          name: z.name,
          url: z.url,
          image: coverUrl ? 'https://cdn.jsdelivr.net/gh/freebuisness/covers@main/' + coverUrl : undefined,
          addedOrder: index
        };
      });
    }

    if (provider === 'elite') {
      const response = await fetch("https://cdn.jsdelivr.net/gh/elite-gamez/elite-gamez.github.io@main/games.json");
      const data = await response.json();
      return data.map((g: any, index: number) => ({
        id: `elite-${index}`,
        provider: 'elite',
        name: g.title || g.name || "Unknown Game",
        url: g.url.startsWith('http') ? g.url : "https://cdn.jsdelivr.net/gh/elite-gamez/elite-gamez.github.io@main/" + g.url,
        image: g.image ? ('https://cdn.jsdelivr.net/gh/elite-gamez/elite-gamez.github.io@main/' + g.image.replace(/^\//, '')) : undefined,
        addedOrder: index
      }));
    }

    if (provider === 'sea-bean') {
      const response = await fetch("https://cdn.jsdelivr.net/gh/sea-bean-unblocked/sde@main/zzz.json");
      const data = await response.json();
      return data.map((g: any, index: number) => {
        let htmlUrl = g.html || g.url || "";
        if (htmlUrl.includes("{HTML_URL}")) {
          htmlUrl = htmlUrl.replace("{HTML_URL}", "https://cdn.jsdelivr.net/gh/sea-bean-unblocked/Singlemile@main/games/");
        } else if (!htmlUrl.startsWith('http')) {
          htmlUrl = "https://cdn.jsdelivr.net/gh/tharun9772/tharun9772.github.io@main/" + htmlUrl.replace(/^\//, '');
        }
        
        let cover = (g.cover || g.img || "").replace("{COVER_URL}/", "").replace(/^\//, "");
        let finalCover = cover.startsWith("https://cdn.jsdelivr.net") 
            ? cover 
            : (cover ? 'https://cdn.jsdelivr.net/gh/sea-bean-unblocked/Singlemile@main/Icon/' + cover : undefined);

        return {
          id: `sea-${index}`,
          provider: 'sea-bean',
          name: g.name || g.id || "Unknown Game",
          url: htmlUrl,
          image: finalCover,
          addedOrder: index
        };
      });
    }

    if (provider === 'ugs') {
      const repos = ["tharun9772/ugs-1", "tharun9772/ugs-2", "tharun9772/ugs-3"];
      let games: GameItem[] = [];
      let globalIndex = 0;
      for (const repo of repos) {
        try {
          const r = await fetch(`https://api.github.com/repos/${repo}/contents/`);
          const d = await r.json();
          if (Array.isArray(d)) {
            d.forEach((f: any) => {
              if (f.type === "file" && f.name.startsWith("cl") && f.name.endsWith(".html")) {
                let cleanName = f.name.replace(/^cl/, "").replace(".html", "");
                cleanName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
                games.push({
                  id: `ugs-${globalIndex++}`,
                  provider: 'ugs',
                  name: cleanName,
                  url: `https://cdn.jsdelivr.net/gh/${repo}@main/${f.name}`,
                  image: "https://cdn.jsdelivr.net/gh/tharun9772/game-assets@main/5968517.png",
                  addedOrder: globalIndex
                });
              }
            });
          }
        } catch (e) {}
      }
      return games;
    }

    if (provider === 'truffled') {
      const response = await fetch("https://cdn.jsdelivr.net/gh/aukak/truffled@main/public/js/json/g.json");
      const data = await response.json();
      const base = proxy?.replace(/\/$/, "") || 'https://truffled.lol';
      return (data.games || []).map((g: any, index: number) => {
        let thumb = g.thumbnail || "";
        let finalThumb = thumb.startsWith('http') 
          ? thumb 
          : `https://cdn.jsdelivr.net/gh/aukak/truffled@main/public/${thumb.replace(/^\//, '')}`;
        
        return {
          id: `truffled-${index}`,
          provider: 'truffled',
          name: g.name,
          url: g.url.startsWith('http') ? g.url : base + (g.url.startsWith('/') ? '' : '/') + g.url,
          image: finalThumb,
          addedOrder: index,
          frameType: g.frameType || 'iframe',
          rawUrl: g.url
        };
      });
    }

    if (provider === 'seraph') {
      const response = await fetch('https://cdn.jsdelivr.net/gh/DominumNetwork/dominum@main/src/assets/libraries/seraph/games.json');
      const data = await response.json();
      return data.map((g: any, index: number) => {
        const gamePath = g.url.endsWith('index.html') ? g.url : g.url.replace(/\/?$/, '/index.html');
        return {
          id: `seraph-${index}`,
          provider: 'seraph',
          name: g.name,
          url: "https://cdn.jsdelivr.net/gh/a456pur/seraph@main/" + gamePath.replace(/^\//, ''),
          image: g.img ? (g.img.startsWith('http') ? g.img : "https://cdn.jsdelivr.net/gh/DominumNetwork/dominum@main/src/assets/libraries/seraph/" + g.img.replace(/^\//, '')) : undefined,
          addedOrder: index
        };
      });
    }

    if (provider === 'petezah') {
      const response = await fetch("https://cdn.jsdelivr.net/gh/PeteZah-G/singlefile-json@main/search.json");
      const data = await response.json();
      return (data.games || []).map((g: any, index: number) => {
        let finalUrl = g.url;
        if (finalUrl && !finalUrl.endsWith('index.html') && !finalUrl.match(/\.\w+$/)) {
          finalUrl = finalUrl.replace(/\/$/, '') + '/index.html';
        }
        
        let thumb = g.imageUrl || "";
        let finalThumb = thumb.startsWith('http')
          ? thumb
          : `https://cdn.jsdelivr.net/gh/PeteZah-G/singlefile-json@main/${thumb.replace(/^\//, '')}`;

        return {
          id: `petezah-${index}`,
          provider: 'petezah',
          name: g.label,
          url: finalUrl,
          image: finalThumb,
          addedOrder: index,
          categories: g.categories || []
        };
      });
    }

    return [];
  } catch (error) {
    console.error(`Failed to fetch games for provider ${provider}:`, error);
    return [];
  }
}
