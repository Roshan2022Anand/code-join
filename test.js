const folder = ".:\nserver.js\nconfig\npublic\nsrc\n\n./config:\ndb.json\napp.config.js\n\n./public:\ncss\njs\nindex.html\n\n./public/css:\nstyles.css\n\n./public/js:\nmain.js\nvendor.js\n\n./src:\ncontrollers\nmodels\nviews\n\n./src/controllers:\nhomeController.js\nuserController.js\n\n./src/models:\nuser.js\npost.js\n\n./src/views:\nhome.html\nuser.html\n"

const folderStruct = {}

const filteredFolder = folder.split('\n').map((item) => {
    if (item.split('')[0] == '.')
        item = item.replace('.', '').replace(':', '')

    return item
}).filter((item) => item !== '')

const setFolder = (k, parent) => {
    if (k >= filteredFolder.length) return

    for (let i = k; i < filteredFolder.length; i++) {
        if (filteredFolder[i].includes('/')) {
            const structure = filteredFolder[i].split("/")
            parent = folderStruct

            for (let j = 1; j < structure.length; j++) {
                if (parent[structure[j]] == "file") parent[structure[j]] = {}
                parent = parent[structure[j]]
            }
            setFolder(i + 1, parent)
            return
        }
        parent[filteredFolder[i]] = "file"
    }
}
setFolder(0, folderStruct)

console.log(folderStruct)