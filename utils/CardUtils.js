function randomInt(min, max) {
  return min + Math.floor((max - min) * Math.random());
}

function randomIntFromArray(array) {
  const min = Math.min.apply(Math, array);
  const max = Math.max.apply(Math, array);
  const r = randomInt(min, max);
  if (!array.includes(r)) {
    return randomIntFromArray(array);
  }
  return r;
}

// TODO revisar esta logica
function getRandomNull(row, col, nullCount) {
  if (col === 6 && nullCount <= 6) {
    row -= 2;
  }
  const randomNull = randomInt(row, 3);
  const isNull = randomNull === 1 || randomNull === 0;
  return isNull;
}

function generateCard() {
  const card = [];
  let nullCount = 0;
  for (let i = 0; i < 9; i++) {
    let array = [];
    for (let j = i * 10; j < i * 10 + 10; j++) {
      array.push(j);
    }
    for (let j = 0; j < 3; j++) {
      const randomN = randomIntFromArray(array);
      const isNull = getRandomNull(j, i, nullCount);
      if (isNull) nullCount++;
      card.push({
        index: randomN,
        number: isNull && nullCount <= 12 ? null : randomN,
      });
      array = array.filter((n) => n !== randomN);
    }
  }

  // TODO remove this when generating null correctly
  if (nullCount < 12) {
    return generateCard();
  }

  return card.sort((a, b) => a.index - b.index);
}

module.exports = generateCard;
