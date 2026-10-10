// ========================================
// 1. LINEAR SEARCH
// ========================================

function linearSearch(dataset, targetValue) {
  let index = 0;
  let finished = false;

  return {
      next() {
          if (finished) {
              return { value: -1, done: true };
          }

          if (index >= dataset.length) {
              finished = true;
              return {
                  value: { type: "not-found" }, done: false
              };
          }

          const currentIndex = index;

          if (dataset[currentIndex] === targetValue) {
              finished = true;
              return {
                  value: { type: "found", index: currentIndex }, done: false
              };
          }
          index++;
          return {
              value: { type: "checked", index: currentIndex },  done: false
          };
      }
  };
}


// ========================================
// 2. BINARY SEARCH
// ========================================


function binarySearch(dataset, targetValue) {
  let left = 0;
  let right = dataset.length - 1;

  let mid = null;
  let phase = "check";
  let finished = false;

  return {
      next() {
          if (finished) {
              return { value: dataset, done: true
              };
          }

          if (left > right) {
              finished = true;
              return {
                  value: { type: "not-found" }, done: false
              };
          }

          if (phase === "check") {
              mid = Math.floor((left + right) / 2);
              phase = "process";
              return {
                  value: { type: "checked", index: mid }, done: false
              };
          }

          if (phase === "process") {
              if (dataset[mid] === targetValue) {
                  finished = true;
                  return {
                      value: { type: "found", index: mid }, done: false
                  };
              }

              if (dataset[mid] < targetValue) {
                  left = mid + 1;
              }

              else {
                  right = mid - 1;
              }

              phase = "check";

              return {
                  value: { type: "pass-complete" }, done: false
              };
          }
      }
  };
}


// ========================================
// 3. BUBBLE SORT
// ========================================


function bubbleSort(dataset) {
  let n = dataset.length;
  let i = 0;
  let j = 0;

  let phase = "compare";
  let finished = false;

  return {
      next() {
          if (finished) {
              return { value: dataset, done: true };
          }

          if (phase === "compare") {
              if (j >= n - i - 1) {
                  i++;
                  j = 0;

                  if (i >= n - 1) {
                      finished = true;
                      return {
                          value: { type: "sorted-all" }, done: false
                      };
                  }

                  return {
                      value: { type: "pass-complete" }, done: false
                  };
              }

              phase = "process";

              return {
                  value: { type: "compare", indices: [j, j + 1] }, done: false
              };
          }

          if (phase === "process") {
              const firstIndex = j;
              const secondIndex = j + 1;

              phase = "compare";

              if (dataset[firstIndex] > dataset[secondIndex]) {
                  [dataset[firstIndex], dataset[secondIndex]] = [ dataset[secondIndex], dataset[firstIndex]];

                  j++;

                  return {
                      value: { type: "swap", indices: [firstIndex, secondIndex] }, done: false
                  };
              }

              j++;

              return {
                  value: { type: "pass-complete" }, done: false
              };
          }
      }
  };
}


// ========================================
// 4. SELECTION SORT
// ========================================

function selectionSort(dataset) {
  const arr = dataset;
  let n = arr.length;
  let i = 0;
  let j = 1;
  let minIndex = 0;

  let phase = "compare";
  let finished = false;

  return {
      next() {
          if (finished) {
              return { value: arr, done: true
              };
          }

          if (i >= n - 1) {
              finished = true;

              return {
                  value: { type: "sorted-all" }, done: false
              };
          }

          if (phase === "compare") {
              if (j >= n) {
                  if (minIndex !== i) {
                      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];

                      phase = "next-pass";

                      return {
                          value: { type: "swap", indices: [i, minIndex] }, done: false
                      };
                  }
                  phase = "next-pass";

                  return {
                      value: { type: "pass-complete" }, done: false
                  };
              }

              const currentIndex = j;
              const previousMin = minIndex;

              if (arr[currentIndex] < arr[minIndex]) {
                  minIndex = currentIndex;
              }

              j++;

              return {
                  value: { type: "compare", indices: [currentIndex, previousMin] }, done: false
              };
          }

          if (phase === "next-pass") {
              i++;
              j = i + 1;
              minIndex = i;
              phase = "compare";

              return {
                  value: { type: "pass-complete" }, done: false
              };
          }
      }
  };
}


// ========================================
// 5. INSERTION SORT
// ========================================


function insertionSort(dataset) {
  const arr = dataset.slice();
  let n = arr.length;
  let i = 1;
  let j = 0;

  let current = null;
  let phase = "start";
  let finished = false;

  return {
      next() {
          if (finished) {
              return { value: arr, done: true };
          }

          if (i >= n) {
              finished = true;
              return {
                  value: { type: "sorted-all" }, done: false
              };
          }

          if (phase === "start") {
              current = arr[i];
              j = i - 1;
              phase = "compare";

              if (j >= 0) {
                  return {
                      value: { type: "compare", indices: [j, i] }, done: false
                  };
              }

              phase = "insert";

              return {
                  value: { type: "pass-complete" }, done: false
              };
          }

          if (phase === "compare") {
              if (j >= 0 && arr[j] > current) {
                  arr[j + 1] = arr[j];
                  phase = "shift";

                  return {
                      value: { type: "overwrite", index: j + 1, value: arr[j + 1] }, done: false
                  };
              }

              phase = "insert";

              return {
                  value: { type: "pass-complete" }, done: false
              };
          }

          if (phase === "shift") {
              j--;
              if (j >= 0) {
                  phase = "compare";
                  return {
                      value: { type: "compare", indices: [j, i] }, done: false
                  };
              }

              phase = "insert";
              return {
                  value: { type: "pass-complete" }, done: false
              };
          }

          if (phase === "insert") {
              arr[j + 1] = current;
              const index = j + 1;
              i++;
              phase = "start";
              return {
                  value: { type: "overwrite", index: index, value: current }, done: false
              };
          }
      }
  };
}


// ========================================
// 6. MERGE SORT
// ========================================


function mergeSort(dataset) {
  const arr = dataset.slice();
  let width = 1;
  let left = 0;

  let phase = "start";
  let mergeState = null;
  let finished = false;

  return {
      next() {
          if (finished) {
              return { value: arr, done: true };
          }

          if (arr.length <= 1) {
              finished = true;
              return {
                  value: { type: "sorted-all" }, done: false
              };
          }

          if (phase === "start") {
              if (width >= arr.length) {
                  finished = true;
                  return {
                      value: {  type: "sorted-all" }, done: false
                  };
              }

              if (left >= arr.length) {
                  width *= 2;
                  left = 0;
                  return {
                      value: { type: "pass-complete" }, done: false
                  };
              }

              const mid = Math.min(left + width, arr.length);
              const right = Math.min(left + width * 2, arr.length);

              mergeState = {
                  leftStart: left,
                  mid: mid,
                  rightEnd: right,
                  left: arr.slice(left, mid),
                  right: arr.slice(mid, right),
                  i: 0,
                  j: 0,
                  k: left
              };

              phase = "merge";
              return {
                  value: { type: "pass-complete" }, done: false
              };
          }

          if (phase === "merge") {
              const m = mergeState;
              if (m.i < m.left.length && m.j < m.right.length) {
                  let value;

                  if (m.left[m.i] <= m.right[m.j]) {
                      value = m.left[m.i];
                      m.i++;
                  }

                  else {
                      value = m.right[m.j];
                      m.j++;
                  }

                  arr[m.k] = value;
                  const index = m.k;
                  m.k++;

                  return {
                      value: { type: "overwrite", index: index, value: value }, done: false
                  };
              }

              if (m.i < m.left.length) {
                  const value = m.left[m.i];
                  arr[m.k] = value;
                  const index = m.k;
                  m.i++;
                  m.k++;

                  return {
                      value: { type: "overwrite", index: index, value: value }, done: false
                  };
              }

              if (m.j < m.right.length) {
                  const value = m.right[m.j];
                  arr[m.k] = value;
          
                  const index = m.k;
                  m.j++;
                  m.k++;

                  return {
                      value: { type: "overwrite", index: index, value: value }, done: false
                  };
              }

              left += width * 2;
              phase = "start";

              return {
                  value: { type: "pass-complete" }, done: false
              };
          }
      }
  };
}


// ========================================
// 7. QUICK SORT
// ========================================

function quickSort(dataset) {
  const arr = dataset;
  const stack = [
      { low: 0, high: arr.length - 1 }
  ];

  let partitionState = null;
  let phase = "start";
  let finished = false;

  return {
      next() {
          if (finished) {
              return { value: arr, done: true };
          }

          if (phase === "start") {
              if (stack.length === 0) {
                  finished = true;
                  return {
                      value: { type: "sorted-all" }, done: false
                  };
              }

              const range = stack.pop();

              if (range.low >= range.high) {
                  return {
                      value: { type: "pass-complete" }, done: false
                  };
              }

              partitionState = {
                  low: range.low,
                  high: range.high,
                  pivot: arr[range.high],
                  i: range.low - 1,
                  j: range.low
              };

              phase = "partition";

              return {
                  value: { type: "pass-complete" }, done: false
              };
          }

          if (phase === "partition") {
              const p = partitionState;

              if (p.j < p.high) {
                  const current = p.j;
                  const pivotIndex = p.high;

                  if (arr[current] < p.pivot) {
                      p.i++;
                      [ arr[p.i], arr[current] ] = [ arr[current], arr[p.i] ];

                      p.j++;
                      return {
                          value: { type: "swap", indices: [p.i, current] }, done: false
                      };
                  }

                  p.j++;
                  return {
                      value: { type: "compare", indices: [current, pivotIndex] }, done: false
                  };
              }

              const pivotIndex = p.i + 1;

              [ arr[pivotIndex], arr[p.high] ] = [ arr[p.high], arr[pivotIndex] ];

              stack.push({ low: p.low, high: pivotIndex - 1 });
              stack.push({ low: pivotIndex + 1, high: p.high });
              phase = "start";

              return {
                  value: { type: "swap", indices: [pivotIndex, p.high] }, done: false
              };
          }
      }
  };
}


// ========================================
// 8. HEAP SORT
// ========================================

function heapSort(dataset) {
  const arr = dataset;

  let n = arr.length;
  let buildIndex = Math.floor(n / 2) - 1;
  let end = n - 1;
  let heapState = null;
  let phase = "build-start";
  let finished = false;

  return {
      next() {
          if (finished) {
              return { value: arr, done: true
              };
          }

          if (phase === "build-start") {
              if (buildIndex < 0) {
                  phase = "extract-start";
                  return { value: { type: "pass-complete" }, done: false
                  };
              }

              heapState = { root: buildIndex, size: n };
              buildIndex--;
              phase = "heapify-build";
              return { value: { type: "pass-complete" }, done: false
              };
          }

          if (phase === "heapify-build") {
              const root = heapState.root;
              const size = heapState.size;
              const left = root * 2 + 1;
              const right = root * 2 + 2;

              if (left >= size) {
                  phase = "build-start";
                  return { value: { type: "pass-complete" }, done: false
                  };
              }

              let largest = root;

              if (arr[left] > arr[largest]) {
                  largest = left;
              }


              if ( right < size && arr[right] > arr[largest] ) {
                  largest = right;
              }

              if (largest !== root) {
                  [ arr[root], arr[largest] ] = [ arr[largest], arr[root] ];

                  heapState.root = largest;

                  return {
                      value: { type: "swap", indices: [root, largest] }, done: false
                  };
              }

              phase = "build-start";
              return { value: { type: "pass-complete" }, done: false
              };
          }

          if (phase === "extract-start") {
              if (end <= 0) {
                  finished = true;
                  return {
                      value: { type: "sorted-all" }, done: false
                  };
              }

              const lastIndex = end;
              [arr[0], arr[lastIndex]] = [arr[lastIndex], arr[0]];
              heapState = {
                  root: 0,
                  size: end
              };

              end--;

              phase = "heapify-extract";
              return { value: { type: "swap", indices: [0, lastIndex] }, done: false
              };
          }

          if (phase === "heapify-extract") {
              const root = heapState.root;
              const size = heapState.size;
              const left =  root * 2 + 1;

              const right = root * 2 + 2;

              if (left >= size) {
                  phase = "extract-start";
                  return {
                      value: { type: "pass-complete" }, done: false
                  };
              }

              let largest = root;

              if (arr[left] > arr[largest]) {
                  largest = left;
              }


              if ( right < size && arr[right] > arr[largest] ) {
                  largest = right;
              }

              if (largest !== root) {
                  [ arr[root], arr[largest] ] = [ arr[largest], arr[root] ];
                  heapState.root = largest;
                  return {
                      value: { type: "swap", indices: [root, largest] }, done: false
                  };
              }

              phase = "extract-start";
              return {
                  value: { type: "pass-complete" }, done: false
              };
          }
      }
  };
}


// ========================================
// 9. ALGORITHM REGISTRY
// ========================================


const algorithms = {
  linear: {
      fn: linearSearch, 
      category: 'searching', 
      label: 'Linear Search',
      bestTime: 'O(1)',
      avgTime: 'O(n)',  
      worstTime: 'O(n)', 
      space: 'O(1)',
      description: 'Checks each element in order until the target value is found or the list is exhausted.'
  },

  binary: {
      fn: binarySearch, 
      category: 'searching', 
      label: 'Binary Search',
      bestTime: 'O(1)',
      avgTime: 'O(log n)', 
      worstTime: 'O(log n)', 
      space: 'O(1)',
      description: 'Repeatedly halves the search range on a sorted list to locate the target value.'
  },

  bubble: {
      fn: bubbleSort, 
      category: 'sorting', 
      label: 'Bubble Sort', 
      bestTime: 'O(n)',
      avgTime: 'O(n²)', 
      worstTime: 'O(n²)', 
      space: 'O(1)',
      description: 'Repeatedly steps through the list, swapping adjacent elements that are out of order, until no swaps remain.'
  },

  selection: {
      fn: selectionSort, 
      category: 'sorting', 
      label: 'Selection Sort', 
      bestTime: 'O(n²)',
      avgTime: 'O(n²)', 
      worstTime: 'O(n²)', 
      space: 'O(1)',
      description: 'Repeatedly finds the smallest remaining element and moves it to the front of the unsorted portion.'
  },

  insertion: {
      fn: insertionSort, 
      category: 'sorting', 
      label: 'Insertion Sort', 
      bestTime: 'O(n)',
      avgTime: 'O(n²)', 
      worstTime: 'O(n²)', 
      space: 'O(1)',
      description: 'Builds the sorted array one element at a time, inserting each new element into its correct position among those already sorted.'
  },

  merge: {
      fn: mergeSort, 
      category: 'sorting', 
      label: 'Merge Sort', 
      bestTime: 'O(n log n)',
      avgTime: 'O(n log n)', 
      worstTime: 'O(n log n)', 
      space: 'O(n)',
      description: 'Recursively splits the array in half, sorts each half, then merges the two sorted halves back together.'
  },

  quick: {
      fn: quickSort, 
      category: 'sorting', 
      label: 'Quick Sort', 
      bestTime: 'O(n log n)',
      avgTime: 'O(n log n)', 
      worstTime: 'O(n²)', 
      space: 'O(n log n)',
      description: 'Picks a pivot element and partitions the array around it, then recursively sorts each partition.'
  },
  heap: {
      fn: heapSort, 
      category: 'sorting', 
      label: 'Heap Sort', 
      bestTime: 'O(n log n)',
      avgTime: 'O(n log n)', 
      worstTime: 'O(n log n)', 
      space: 'O(1)',
      description: 'Builds a max-heap from the array, then repeatedly moves the largest remaining element into its final sorted position.'
  }
};
