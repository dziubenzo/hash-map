class HashSet {
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
    const keys = this.keys();
    this.buckets = new Array(this.#capacity);
    for (const key of keys) {
      this.set(key);
    }
  }

  set(key) {
    // Avoid adding duplicate keys
    if (this.has(key)) {
      throw new Error('Key already exists in hash set');
    }
    // Check load and double buckets if necessary
    if (this.#getExpectedLoad() >= this.#loadFactor) {
      this.#doubleBuckets();
    }
    const index = this.#getIndex(key);
    this.#checkLimitation(index);
    const node = new Node(key);
    // Insert node immediately if index empty
    if (this.buckets[index] === undefined) {
      return (this.buckets[index] = node);
    }
    let firstNode = this.buckets[index];
    do {
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
        return firstNode.key;
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
      throw new Error('Key does not exist in hash set');
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
}

class Node {
  constructor(key) {
    this.key = key;
    this.next = null;
  }
}

// Keys for tests
const keys11 = [
  23123, 433489, 3240932, 998, 2397432, 3298327, 219065541, 545478, 7748894,
  789895464, 8787989894,
];

const keys16 = keys11.concat([
  4894912, 774845, 8780002, 89632159, 534654865545,
]);

const hashSet = new HashSet();

for (const key of keys16) {
  hashSet.set(key);
}

console.log(hashSet.buckets);
