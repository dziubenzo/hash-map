class HashMap {
  #capacity = 16;
  #loadFactor = 0.75;

  constructor() {
    this.buckets = new Array(this.#capacity);
  }

  #getIndex(key) {
    return key % this.#capacity;
  }

  #checkLimitation(index) {
    if (index < 0 || index >= this.buckets.length) {
      throw new Error('Trying to access index out of bound');
    }
  }

  #getExpectedLoad() {
    return (this.length() + 1) / this.#capacity;
  }

  #doubleBuckets() {
    this.#capacity *= 2;
    const values = this.values();
    this.buckets = new Array(this.#capacity);
    for (const value of values) {
      const key = this.hash(value);
      this.set(key, value);
    }
  }

  hash(value) {
    let key = 0;
    const primeNumber = 31;
    for (let i = 0; i < value.length; i++) {
      key = primeNumber * key + value.charCodeAt(i);
    }
    return key;
  }

  set(key, value) {
    // Check load and double buckets if necessary
    if (this.#getExpectedLoad() >= this.#loadFactor) {
      this.#doubleBuckets();
    }
    const index = this.#getIndex(key);
    this.#checkLimitation(index);
    const node = new Node(key, value);
    // Insert node immediately if index empty
    if (this.buckets[index] === undefined) {
      return (this.buckets[index] = node);
    }
    let firstNode = this.buckets[index];
    do {
      // Update value is keys match
      if (firstNode.key === node.key) {
        firstNode.value = node.value;
        return;
      }
      if (firstNode.next !== null) {
        firstNode = firstNode.next;
      } else {
        break;
      }
    } while (true);
    // Add node to the tail of linked list
    firstNode.next = node;
  }

  get(key) {
    const index = this.#getIndex(key);
    this.#checkLimitation(index);
    if (this.buckets[index] === undefined) {
      return null;
    }
    let firstNode = this.buckets[index];
    do {
      if (firstNode.key === key) {
        return firstNode.value;
      }
      if (firstNode.next !== null) {
        firstNode = firstNode.next;
      } else {
        break;
      }
    } while (true);
    return null;
  }

  has(key) {
    if (this.get(key)) {
      return true;
    }
    return false;
  }

  remove(key) {
    if (!this.has(key)) {
      throw new Error('Key-value pair does not exist in hash map');
    }
    const index = this.#getIndex(key);
    this.#checkLimitation(index);
    // Handle case when key is the first node
    if (this.buckets[index].key === key) {
      if (this.buckets[index].next === null) {
        return delete this.buckets[index];
      } else {
        return (this.buckets[index] = this.buckets[index].next);
      }
    }
    // Handle case when key is somewhere else in linked list
    let currentNode = this.buckets[index];
    let nextNode = this.buckets[index].next;
    while (true) {
      if (nextNode.key === key) {
        return (currentNode.next = currentNode.next.next || null);
      }
      currentNode = nextNode;
      nextNode = nextNode.next || null;
    }
  }

  length() {
    let counter = 0;
    for (let bucket of this.buckets) {
      if (bucket instanceof Node) {
        while (bucket !== null) {
          counter++;
          bucket = bucket.next;
        }
      }
    }
    return counter;
  }

  clear() {
    // Reset buckets size to 16
    this.#capacity = 16;
    this.buckets = new Array(this.#capacity);
  }

  keys() {
    const keys = [];
    for (let bucket of this.buckets) {
      if (bucket instanceof Node) {
        while (bucket !== null) {
          keys.push(bucket.key);
          bucket = bucket.next;
        }
      }
    }
    return keys;
  }

  values() {
    const values = [];
    for (let bucket of this.buckets) {
      if (bucket instanceof Node) {
        while (bucket !== null) {
          values.push(bucket.value);
          bucket = bucket.next;
        }
      }
    }
    return values;
  }

  entries() {
    const keys = this.keys();
    const values = this.values();
    const entries = [];
    for (let i = 0; i < keys.length; i++) {
      entries.push([keys[i], values[i]]);
    }
    return entries;
  }
}

class Node {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.next = null;
  }
}

// Values for tests

const array11 = [
  'Aberforth',
  'Albus',
  'Amos',
  'Cedric',
  'Colin',
  'Dean',
  'Draco',
  'Dudley',
  'Fred',
  'George',
  'Godric',
];

const array16 = array11.concat([
  'Horace',
  'Lucius',
  'Neville',
  'Percy',
  'Remus',
]);

const array30 = array16.concat([
  'Ronald',
  'Seamus',
  'Severus',
  'Sirius',
  'Vernon',
  'Viktor',
  'Bellatrix',
  'Dolores',
  'Ginny',
  'Fleur',
  'Hedwig',
  'Hermione',
  'Luna',
  'Petunia',
]);

const hashMap = new HashMap();

for (const value of array30) {
  const key = hashMap.hash(value);
  hashMap.set(key, value);
}

console.log(hashMap.buckets);
console.log(hashMap.entries());
