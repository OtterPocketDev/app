export default function File(id, name, size, timestamp, type, hash, baseLink) {
  this.id = id;
  this.name = name;
  this.size = size;
  this.timestamp = timestamp;
  this.type = type;
  this.hash = hash;
  this.link = baseLink;
}
