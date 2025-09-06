const areAnograms = (str1, str2) => {
  return str1.split("").sort().join("") === str2.split("").sort().join("");
};

/**
 * @param {string[]} strs
 * @return {string[][]}
 */
function anagramGroups(strs) {
  const processed = new Set();

  const res = [];

  for (let i = 0; i < strs.length; i++) {
    if (processed.has(i)) {
      continue;
    }

    const str1 = strs[i];
    const group = [str1];

    for (let j = i + 1; j < strs.length; j++) {
      if (processed.has(i)) {
        continue;
      }

      const str2 = strs[j];

      if (areAnograms(str1, str2)) {
        group.push(str2);
        processed.add(j);
      }
    }

    res.push(group);
    processed.add(i);
  }

  return res;
}

console.log(anagramGroups(["kxac"]));
