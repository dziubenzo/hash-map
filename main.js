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

hashMap.set(213232, 'Fragile 3');
console.log(hashMap.has(213232));
hashMap.set(21323232, 'Fragile 4');
// hashMap.remove(213232);
console.log(hashMap.buckets);
console.log(hashMap.length());
