class HashMap {
  #capacity = 16;
  #loadFactor = 0.75;

  constructor() {
    this.buckets = [];
  }

  hash(value) {
    let code = 0;
    const primeNumber = 31;
    for (let i = 0; i < value.length; i++) {
      code = primeNumber * code + value.charCodeAt(i);
    }
    return code;
  }
}

const hashMap = new HashMap();
console.log(hashMap.buckets);
