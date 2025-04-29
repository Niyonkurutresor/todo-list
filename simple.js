class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  append(value) {
    const newNode = new Node(value);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }

    this.length++;
    return this;
  }

  prepend(value) {
    const newNode = new Node(value);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head = newNode;
    }

    this.length++;
    return this;
  }

  getNodeAtIndex(index) {
    if (index < 0 || index >= this.length) return null;

    let current = this.head;
    let counter = 0;

    while (counter < index) {
      current = current.next;
      counter++;
    }

    return current;
  }

  insert(index, value) {
    //invalid
    if (index < 0 || index > this.length) return false;

    //at beginning
    if (index === 0) return this.prepend(value);

    //at end
    if (index === this.length) return this.append(value);

    const newNode = new Node(value);
    const prevNode = this.getNodeAtIndex(index - 1);

    newNode.next = prevNode.next;
    prevNode.next = newNode;

    this.length++;
    return this;
  }

  removeAt(index) {
    if (index < 0 || index >= this.length) return null;

    if (index === 0) {
      const removedNode = this.head;

      if (this.length === 1) {
        this.head = null;
        this.tail = null;
      } else {
        this.head = this.head.next;
      }

      this.length--;
      return removedNode;
    }

    const prevNode = this.getNodeAtIndex(index - 1);
    const removedNode = prevNode.next;

    if (index === this.length - 1) {
      this.tail = prevNode;
      prevNode.next = null;
    } else {
      prevNode.next = removedNode.next;
    }

    this.length--;
    return removedNode;
  }

  remove(value) {
    if (!this.head) return false;

    if (this.head.value === value) {
      if (this.length === 1) {
        this.head = null;
        this.tail = null;
      } else {
        this.head = this.head.next;
      }

      this.length--;
      return true;
    }

    let current = this.head;
    while (current.next && current.next.value !== value) {
      current = current.next;
    }

    if (current.next) {
      if (current.next === this.tail) {
        this.tail = current;
      }

      current.next = current.next.next;
      this.length--;
      return true;
    }

    return false;
  }

  indexOf(value) {
    let current = this.head;
    let index = 0;

    while (current) {
      if (current.value === value) {
        return index;
      }
      current = current.next;
      index++;
    }

    return -1;
  }

  contains(value) {
    return this.indexOf(value) !== -1;
  }

  reverse() {
    if (!this.head || this.length === 1) return this;

    let prev = null;
    let current = this.head;
    let next = null;

    this.tail = this.head;

    while (current) {
      // Save next before we overwrite current.next
      next = current.next;

      // Reverse the pointer
      current.next = prev;

      // Move prev and current one step forward
      prev = current;
      current = next;
    }

    // Update head
    this.head = prev;

    return this;
  }

  toArray() {
    const array = [];
    let current = this.head;

    while (current) {
      array.push(current.value);
      current = current.next;
    }

    return array;
  }

  size() {
    return this.length;
  }

  clear() {
    this.head = null;
    this.tail = null;
    this.length = 0;
    return this;
  }

  print() {
    let result = "";
    let current = this.head;

    while (current) {
      result += current.value;
      if (current.next) result += " -> ";
      current = current.next;
    }

    return result || "Empty list";
  }
}

const list = new LinkedList();

list.append(1);
list.append(2);
list.append(3);
list.prepend(0);

console.log(list.print());
console.log(list.toArray());

list.insert(2, 1.5);
console.log(list.print());

list.removeAt(0);
console.log(list.print());

list.remove(3);
console.log(list.print());

list.reverse();
console.log(list.print());

console.log(list.indexOf(1.5));
console.log(list.contains(5));
console.log(list.getNodeAtIndex(0).value);
console.log(list.size());

list.clear();
console.log(list.print());
