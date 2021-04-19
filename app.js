import firebase from 'firebase/app'
import 'firebase/storage'
import { upload } from './upload'

const firebaseConfig = {
    apiKey: "AIzaSyBx8QTg7r28HwALxlpP_lbaD91E4vNYi9U",
    authDomain: "fe-upload-bc61c.firebaseapp.com",
    projectId: "fe-upload-bc61c",
    storageBucket: "fe-upload-bc61c.appspot.com",
    messagingSenderId: "336680387219",
    appId: "1:336680387219:web:32303606c317fd58f28366"
}

firebase.initializeApp(firebaseConfig)

const storage = firebase.storage()

upload('#file', {
    multi: true,
    accept: [
        '.png',
        '.jpg',
        '.jpeg',
        '.gif'
    ],
    onUpload(files, blocks) {
        files.forEach((file, index) => {
            const ref = storage.ref(`images/${file.name}`)
            const task = ref.put(file)

            task.on('state_changed', snapshot => {
                const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%'
                const block = blocks[index].querySelector('.preview-info-progress')
                block.textContent = percentage
                block.style.width = percentage
            }, error => {
                console.log(error)
            }, () => {
                task.snapshot.ref.getDownloadURL().then(url => {
                    console.log('Download URL', url)
                })
            })
        })
    }
})