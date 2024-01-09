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

  hash(value) {
    let key = 0;
    const primeNumber = 31;
    for (let i = 0; i < value.length; i++) {
      key = primeNumber * key + value.charCodeAt(i);
    }
    return key;
  }

  set(key, value) {
    /* 
    TO DO: Check for whether the buckets need to be resized once length() and values() are implemented
    */
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
      firstNode = firstNode.next;
    } while (firstNode.next !== null);
    // Add node to the tail of linked list
    firstNode.next = newNode;
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
      firstNode = firstNode.next;
    } while (firstNode.next !== null);
    return null;
  }
}

class Node {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.next = null;
  }
}

const hashMap = new HashMap();

const value1 = 'Fragile';
const key1 = hashMap.hash(value1);
hashMap.set(key1, value1);

const value2 = 'Fragile 2';
const key2 = hashMap.hash(value2);
hashMap.set(key2, value2);

console.log(hashMap.buckets);
console.log(hashMap.get(key2));
