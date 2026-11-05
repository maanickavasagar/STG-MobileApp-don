const fs = require('fs');
const zlib = require('zlib');

function getVersionCode(filePath) {
  const buf = fs.readFileSync(filePath);
  let idx = 0;
  while (idx < buf.length - 4) {
    if (buf.readUInt32LE(idx) === 0x04034b50) {
      const nameLen = buf.readUInt16LE(idx + 26);
      const extraLen = buf.readUInt16LE(idx + 28);
      const compMethod = buf.readUInt16LE(idx + 8);
      const compSize = buf.readUInt32LE(idx + 18);
      const fileName = buf.toString('utf8', idx + 30, idx + 30 + nameLen);
      const dataOffset = idx + 30 + nameLen + extraLen;
      
      if (fileName === 'base/manifest/AndroidManifest.xml') {
        let data = buf.slice(dataOffset, dataOffset + compSize);
        if (compMethod === 8) {
          try { data = zlib.inflateRawSync(data); } catch(e) {}
        }
        const vcPos = data.indexOf(Buffer.from('versionCode'));
        console.log(filePath, 'versionCode offset:', vcPos);
        if (vcPos !== -1) {
          // print next 40 bytes in hex
          console.log(data.slice(vcPos, vcPos + 40));
        }
      }
      idx = dataOffset + compSize;
    } else {
      idx++;
    }
  }
}

getVersionCode('d:/newapp/stgmobileapp/upmi-v2.7-release.aab');
getVersionCode('d:/newapp/stgmobileapp/upmi-v3.0-release.aab');
