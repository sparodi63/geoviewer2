export default function getTmsMaxLevel (maxScale) {
  let maxLevel = 12
  if (maxScale <= 2000 || maxScale == null) {
    maxLevel = 17
  }
  if (maxScale > 2000 && maxScale <= 6250) {
    maxLevel = 16
  }
  if (maxScale > 6250 && maxScale <= 12500) {
    maxLevel = 15
  }
  if (maxScale > 12500 && maxScale <= 25000) {
    maxLevel = 14
  }
  if (maxScale > 25000 && maxScale <= 50000) {
    maxLevel = 13
  }
  return maxLevel
}

