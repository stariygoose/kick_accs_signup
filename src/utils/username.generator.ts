export class UsernameGenerator {
  private static readonly STREAMERS = [
    'mellstroy', 'zloy', 'evelone', 'kaisanat', 'ishowspeed', 'dmitriy_lixxx', 'rekrent', 
    'bratishkin', 'dedp47', 'papich', 'lasqa', 'pusher', 'maddyson', 'goodwin', 'shamanking',
    'silvername', 'dreddd', 'xboct', 'rampage', 'arthas', 'alohadance', 'versuta', 'larin',
    'dakotaz', 'hard_play', 'welovegames', 'wylsacom', 'usachev', 'kuplinov', 'toha', 'syenduk'
  ];

  private static readonly CASINO_MEMES = [
    'slotik', 'sloter', 'katka', 'bonus', 'jackpot', 'scatter', 'wild', 'freespin', 'maxbet',
    'dogecoin', 'bitcoin', 'ethernim', 'bustabit', 'crash', 'multiplier', 'withdraw', 'deposit',
    'lucky', 'unlucky', 'broke', 'rich', 'profit', 'loss', 'stonks', 'rekt', 'moon', 'lambo',
    'degen', 'ape', 'yolo', 'fomo', 'hodl', 'pump', 'dump', 'dip', 'rocket', 'diamond'
  ];

  private static readonly POPULAR_MEMES = [
    'pepe', 'kekw', 'omegalul', 'sadge', 'copium', 'hopium', 'poggers', 'monkas', 'pepega',
    'chad', 'virgin', 'wojak', 'doomer', 'bloomer', 'coomer', 'boomer', 'zoomer', 'sigma',
    'amogus', 'sus', 'crewmate', 'impostor', 'sussy', 'baka', 'bruh', 'sheesh', 'bussin',
    'cap', 'nocap', 'based', 'cringe', 'pog', 'stonks', 'yeet', 'simp', 'karen', 'okboomer',
    'doge', 'bonk', 'gigachad', 'beta', 'alpha', 'ligma', 'sugma', 'candice', 'joemama',
    'deez', 'nuts', 'rickroll', 'troll', 'kappa', 'pepehands', 'feelsbad', 'feelsgood',
    'peeposorry', 'peepohappy', 'peeposad', 'catjam', 'dancin', 'vibing', 'chillin', 'gaming'
  ];

  private static readonly ANIME_CHARACTERS = [
    'naruto', 'sasuke', 'sakura', 'kakashi', 'itachi', 'gaara', 'hinata', 'shikamaru',
    'goku', 'vegeta', 'gohan', 'piccolo', 'frieza', 'cell', 'buu', 'trunks', 'krillin',
    'luffy', 'zoro', 'sanji', 'nami', 'chopper', 'robin', 'brook', 'franky', 'usopp',
    'ichigo', 'rukia', 'orihime', 'uryu', 'byakuya', 'kenpachi', 'toshiro', 'gin',
    'natsu', 'lucy', 'gray', 'erza', 'wendy', 'gajeel', 'levy', 'juvia', 'laxus',
    'edward', 'alphonse', 'winry', 'roy', 'riza', 'scar', 'izumi', 'may', 'ling',
    'light', 'ryuk', 'misa', 'lawliet', 'near', 'mello', 'matsuda', 'watari',
    'saitama', 'genos', 'tatsumaki', 'fubuki', 'king', 'sonic', 'garou', 'bang',
    'kirito', 'asuna', 'klein', 'silica', 'lisbeth', 'sinon', 'leafa', 'yui',
    'rimuru', 'veldora', 'shizu', 'benimaru', 'shion', 'souei', 'hakurou', 'ranga',
    'jotaro', 'dio', 'josuke', 'giorno', 'jolyne', 'jonathan', 'joseph', 'kakyoin',
    'deku', 'bakugo', 'todoroki', 'uraraka', 'iida', 'tsuyu', 'kirishima', 'momo',
    'tanjiro', 'nezuko', 'zenitsu', 'inosuke', 'giyu', 'rengoku', 'tengen', 'mitsuri',
    'eren', 'mikasa', 'armin', 'levi', 'erwin', 'hange', 'sasha', 'connie', 'jean',
    'senku', 'taiju', 'yuzuriha', 'tsukasa', 'chrome', 'kohaku', 'suika', 'gen'
  ];

  private static readonly GAME_CHARACTERS = [
    'mario', 'luigi', 'peach', 'bowser', 'yoshi', 'toad', 'koopa', 'goomba',
    'link', 'zelda', 'ganondorf', 'samus', 'pikachu', 'charizard', 'blastoise', 'venusaur',
    'sonic', 'tails', 'knuckles', 'shadow', 'silver', 'amy', 'cream', 'rouge',
    'master', 'chief', 'cortana', 'arbiter', 'johnson', 'miranda', 'guilty', 'spark',
    'kratos', 'atreus', 'freya', 'odin', 'thor', 'baldur', 'mimir', 'brok', 'sindri',
    'geralt', 'ciri', 'yennefer', 'triss', 'dandelion', 'vesemir', 'lambert', 'eskel',
    'cloud', 'tifa', 'aerith', 'barret', 'vincent', 'yuffie', 'cid', 'sephiroth',
    'snake', 'liquid', 'otacon', 'gray', 'fox', 'raiden', 'ocelot', 'bigboss',
    'gordon', 'freeman', 'alyx', 'vance', 'barney', 'gman', 'headcrab', 'combine',
    'doom', 'slayer', 'doomguy', 'samuel', 'hayden', 'vega', 'olivia', 'pierce',
    'steve', 'alex', 'creeper', 'enderman', 'zombie', 'skeleton', 'spider', 'witch',
    'tracer', 'reaper', 'mercy', 'reinhardt', 'dva', 'genji', 'hanzo', 'widowmaker',
    'ryu', 'ken', 'chunli', 'akuma', 'sagat', 'dhalsim', 'blanka', 'zangief',
    'leon', 'claire', 'jill', 'chris', 'ada', 'wesker', 'nemesis', 'tyrant'
  ];

  private static readonly ADJECTIVES = [
    'dark', 'light', 'shadow', 'bright', 'silent', 'loud', 'swift', 'slow', 'wild', 'calm',
    'fire', 'ice', 'storm', 'wind', 'earth', 'water', 'blood', 'soul', 'mind', 'heart',
    'dead', 'alive', 'ghost', 'demon', 'angel', 'dragon', 'wolf', 'lion', 'eagle', 'snake',
    'night', 'day', 'moon', 'sun', 'star', 'void', 'chaos', 'order', 'magic', 'mystic',
    'royal', 'noble', 'savage', 'brutal', 'gentle', 'kind', 'evil', 'holy', 'cursed', 'blessed',
    'frozen', 'burning', 'electric', 'toxic', 'steel', 'golden', 'silver', 'crimson', 'azure',
    'ancient', 'eternal', 'mortal', 'divine', 'fallen', 'risen', 'broken', 'perfect', 'lost',
    'tiny', 'giant', 'mini', 'mega', 'ultra', 'super', 'hyper', 'cyber', 'neo', 'retro',
    'lucky', 'unlucky', 'crazy', 'mad', 'cool', 'hot', 'cold', 'warm', 'fresh', 'old'
  ];

  private static readonly NOUNS = [
    'warrior', 'mage', 'rogue', 'knight', 'archer', 'assassin', 'hunter', 'slayer', 'guardian',
    'king', 'queen', 'prince', 'princess', 'lord', 'lady', 'master', 'sensei', 'ninja', 'samurai',
    'wolf', 'dragon', 'phoenix', 'tiger', 'lion', 'eagle', 'hawk', 'raven', 'fox', 'bear',
    'blade', 'sword', 'bow', 'staff', 'hammer', 'axe', 'spear', 'dagger', 'shield', 'armor',
    'flame', 'frost', 'thunder', 'lightning', 'storm', 'wind', 'earth', 'water', 'fire', 'air',
    'shadow', 'light', 'darkness', 'void', 'chaos', 'order', 'magic', 'spell', 'curse', 'blessing',
    'soul', 'spirit', 'ghost', 'demon', 'angel', 'god', 'devil', 'beast', 'monster', 'titan',
    'star', 'moon', 'sun', 'comet', 'meteor', 'planet', 'galaxy', 'universe', 'cosmos', 'infinity',
    'player', 'gamer', 'noob', 'pro', 'legend', 'hero', 'villain', 'boss', 'chief', 'captain',
    'cat', 'dog', 'bird', 'fish', 'rabbit', 'mouse', 'panda', 'koala', 'penguin', 'dolphin'
  ];

  private static readonly FEMININE_WORDS = [
    'princess', 'queen', 'goddess', 'angel', 'fairy', 'butterfly', 'flower', 'rose', 'lily',
    'moon', 'star', 'diamond', 'pearl', 'crystal', 'ruby', 'emerald', 'sapphire', 'heart', 'love',
    'kitten', 'bunny', 'kitty', 'pony', 'unicorn', 'rainbow', 'cloud', 'dream', 'wish', 'hope',
    'cherry', 'peach', 'honey', 'sugar', 'candy', 'cake', 'cookie', 'cupcake', 'muffin', 'berry',
    'chan', 'kawaii', 'chibi', 'neko', 'usagi', 'sakura', 'yuki', 'hana', 'momo', 'emi'
  ];

  private static transliterate(text: string): string {
    const translitMap: { [key: string]: string } = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
      'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
      'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts',
      'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ы': 'y', 'э': 'e', 'ю': 'yu', 'я': 'ya',
      'ь': '', 'ъ': '', 'і': 'i', 'ї': 'yi', 'є': 'ye', 'ґ': 'g'
    };

    return text.toLowerCase().split('').map(char => translitMap[char] || char).join('');
  }

  private static getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private static randomCapitalization(word: string): string {
    const patterns = [
      word.toLowerCase(),
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
      word.toUpperCase(),
      word.split('').map((char, index) => 
        index % 2 === 0 ? char.toUpperCase() : char.toLowerCase()
      ).join(''),
      word.split('').map((char, index) => 
        index % 2 === 1 ? char.toUpperCase() : char.toLowerCase()
      ).join('')
    ];
    
    return this.getRandomElement(patterns);
  }

  private static generateNumbers(): string {
    const shouldAddNumbers = Math.random() < 0.4;
    if (!shouldAddNumbers) return '';
    
    const patterns = [
      Math.floor(Math.random() * 100).toString(),
      Math.floor(Math.random() * 10).toString() + Math.floor(Math.random() * 10).toString(),
      ['69', '420', '666', '777', '228', '1337', '007', '911', '123', '321'][Math.floor(Math.random() * 10)]
    ];
    
    return this.getRandomElement(patterns);
  }

  private static generateOneWord(): string {
    const allWords = [
      ...this.STREAMERS,
      ...this.CASINO_MEMES,
      ...this.POPULAR_MEMES,
      ...this.ANIME_CHARACTERS,
      ...this.GAME_CHARACTERS,
      ...this.ADJECTIVES,
      ...this.NOUNS,
      ...this.FEMININE_WORDS
    ];
    
    const word = this.getRandomElement(allWords);
    const capitalizedWord = this.randomCapitalization(word);
    const numbers = this.generateNumbers();
    
    return `${capitalizedWord}${numbers}`;
  }

  private static generateTwoWords(): string {
    const wordSets = [
      [this.ADJECTIVES, this.NOUNS],
      [this.POPULAR_MEMES, this.STREAMERS],
      [this.CASINO_MEMES, this.ADJECTIVES],
      [this.ANIME_CHARACTERS, this.GAME_CHARACTERS],
      [this.STREAMERS, this.CASINO_MEMES],
      [this.ADJECTIVES, this.FEMININE_WORDS],
      [this.POPULAR_MEMES, this.ANIME_CHARACTERS]
    ];
    
    const [set1, set2] = this.getRandomElement(wordSets);
    const word1 = this.randomCapitalization(this.getRandomElement(set1));
    const word2 = this.randomCapitalization(this.getRandomElement(set2));
    const numbers = this.generateNumbers();
    
    const separators = ['', '_'];
    const separator = this.getRandomElement(separators);
    
    return `${word1}${separator}${word2}${numbers}`;
  }

  public static generate(): string {
    const patterns = [
      () => this.generateOneWord(),
      () => this.generateTwoWords()
    ];
    
    const weights = [0.4, 0.6];
    const randomValue = Math.random();
    const selectedPattern = randomValue < weights[0] ? patterns[0] : patterns[1];
    
    const username = selectedPattern();
    return this.transliterate(username);
  }

  public static generateMultiple(count: number): string[] {
    const usernames: string[] = [];
    const uniqueUsernames = new Set<string>();

    while (uniqueUsernames.size < count) {
      const username = this.generate();
      if (!uniqueUsernames.has(username)) {
        uniqueUsernames.add(username);
        usernames.push(username);
      }
    }

    return usernames;
  }

  public static getEstimatedCombinations(): number {
    const allWords = this.STREAMERS.length + this.CASINO_MEMES.length + this.POPULAR_MEMES.length + 
                    this.ANIME_CHARACTERS.length + this.GAME_CHARACTERS.length + this.ADJECTIVES.length + 
                    this.NOUNS.length + this.FEMININE_WORDS.length;
    
    const capitalizationPatterns = 5;
    const numberPatterns = 15;
    const separatorPatterns = 2;
    
    const oneWordCombinations = allWords * capitalizationPatterns * numberPatterns;
    const twoWordCombinations = allWords * allWords * capitalizationPatterns * capitalizationPatterns * 
                               separatorPatterns * numberPatterns;
    
    return oneWordCombinations + twoWordCombinations;
  }
}
