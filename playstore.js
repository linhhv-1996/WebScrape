getPlayStore().then(result => console.log(result))


function getOrDefault (obj, indices, fallback = '', post = (x) => x) {
    let i
    try {
      for (i = 0; i < indices.length; i++) {
        obj = obj[indices[i]]
      }
      if (obj != null) {
        return post(obj)
      }
    } catch (e) {
      console.warn(`at i=${i} in ${indices}`, e, '\nin obj:', obj)
    }
    return fallback
}


async function getPlayStore (packageName, ctx, hl, gl) {

    packageName = 'com.ardrawing.tracedrawing.drawingsketch.drawingapps'
    const url = `https://play.google.com/store/apps/details?id=${packageName}`

    const content = await (await fetch(url)).text()

  
    const parts = content.split('AF_initDataCallback({').slice(1).map(v => v.split('</script>')[0])
    if (parts.length === 0) {
      throw new Error(`Failed to extract data from play store [${packageName}]`)
    }
  
    const dataString = parts.filter(s => s.indexOf(`["${packageName}"],`) !== -1)[0].trim()
    const noDataString = dataString.substring(dataString.indexOf('data:') + 5)
    let arrString = noDataString.split('sideChannel:')[0].trim()
    arrString = arrString.substring(0, arrString.length - 1) // remove trailing comma
  
    const json = JSON.parse(arrString)
  
    const fallback = 'Varies with device'
  
    const result = {
      name: getOrDefault(json, [1, 2, 0], fallback),
      installs: getOrDefault(json, [1, 2, 13, 0], fallback),
      totalinstalls: getOrDefault(json, [1, 2, 13, 2], fallback, (n) => n.toLocaleString()),
      shortinstalls: getOrDefault(json, [1, 2, 13, 3], fallback),
      version: getOrDefault(json, [1, 2, 140, 0, 0], fallback),
      updated: getOrDefault(json, [1, 2, 145, 0, 0], fallback),
      targetandroid: getOrDefault(json, [1, 2, 140, 1, 0, 0, 1], fallback),
      targetsdk: getOrDefault(json, [1, 2, 140, 1, 0, 0, 0], fallback),
      android: getOrDefault(json, [1, 2, 140, 1, 1, 0, 0, 1], fallback),
      minsdk: getOrDefault(json, [1, 2, 140, 1, 1, 0, 0, 0], fallback),
      rating: getOrDefault(json, [1, 2, 51, 0, 0], fallback),
      floatrating: getOrDefault(json, [1, 2, 51, 0, 1], fallback),
      friendly: getOrDefault(json, [1, 2, 9, 0], fallback),
      published: getOrDefault(json, [1, 2, 10, 0], fallback)
    }
  
    return result
}
