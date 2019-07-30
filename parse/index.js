let last, timeout

module.exports = (res, cb) => {
  const values = []
  res
    .replace(/\}[\n\r]?\{/g, '}|--|{') // }{
    .replace(/\}\][\n\r]?\[\{/g, '}]|--|[{') // }][{
    .replace(/\}[\n\r]?\[\{/g, '}|--|[{') // }[{
    .replace(/\}\][\n\r]?\{/g, '}]|--|{') // }]{
    .split('|--|')
    .forEach(data => {
      if (last) data = last + data // prepend the last chunk
      let result
      try {
        result = JSON.parse(data)
      } catch (e) {
        last = data
        clearTimeout(timeout) // restart timeout
        timeout = setTimeout(() => cb(new Error('Parse response timeout')), 15 * 1000)
        return
      }
      clearTimeout(timeout)
      last = null
      if (result) values.push(result)
    })
  cb(null, values)
}
