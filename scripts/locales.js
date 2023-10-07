import fs from "fs"

let locales = JSON.parse(fs.readFileSync("./src/locale/locales.json", "utf8"))

let translations = {}

function main() {
  for (let loc in locales) {
    translations[loc] = JSON.parse(fs.readFileSync("./src/locale/vee-validate/"+loc+".json", "utf8"))
    translations[loc].language = locales[loc]
  }
  let newTranslations = JSON.parse(fs.readFileSync("./src/locale/translations.json", "utf8"))
  for (let key in newTranslations) {
    for (let loc in locales) {
      translations[loc].messages[key] = newTranslations[key][loc]
    }
  }
  for (let loc in translations) {
    let json = JSON.stringify(translations[loc], null, 2)
    fs.writeFileSync("./locale/"+loc+".json", json)
  }
}

main()
console.log("Done!")
