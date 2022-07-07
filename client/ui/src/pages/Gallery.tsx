import { useEffect, useState } from 'react'
import '../styles/Gallery.css'
import useStore from '../utils/stores'
import { Config } from '../Config' 

const Gallery = () => {
    const store = useStore()
    const [images, setImages] = useState(store.gallery)
    const [preview, setPreviewEnabled] = useState(false)
    const [previewSrc, setPreviewSrc] = useState('')
    const [previewLabel, setPreviewLabel] = useState('')
    const [previewIndex, setPreviewIndex] = useState(0)

    useEffect(() => {
        setImages(store.gallery)
    }, [store.gallery]) 

    const handleImage = (e:any) => {
        setPreviewSrc(e.url)
        setPreviewLabel(e.label)
        setPreviewIndex(e.index)
        setPreviewEnabled(true)
    }

    const handleInput = (e:any) => {
        setPreviewLabel(e.target.value)
    }

    const saveImage = () => {
        if(previewLabel.length <= 15){
            $.post('https://fm_phone/saveImageName', JSON.stringify({
                name: previewLabel, 
                imgIndex: previewIndex  
            }))
    
            setPreviewSrc('')
            setPreviewLabel('')
        }
    }

    const deleteImage = () => {
        $.post('https://fm_phone/deleteImage', JSON.stringify({ 
            imgIndex: previewIndex  
        }))

        setPreviewSrc('')
        setPreviewLabel('')
        setPreviewIndex(0)
        setPreviewEnabled(false)
    }

    return (
        <div className='gallery-container'>
            <div className='image-scrolldown'>
                {
                    images.map((e:any) => {
                        if(e){
                            return (
                                <div className='image-container' key={ e.index } onClick={() => handleImage(e) }>
                                    <img 
                                        src={ e.url }
                                        onError={({ currentTarget }) => {
                                            currentTarget.onerror = null;
                                            currentTarget.src= Config['messages']['default'].picture;
                                        }}
                                    />

                                    <label className='date'>{ e.date }</label>
                                    <label className='name'>{ e.label }</label>
                                </div>
                            )
                        }
                    })
                }
            </div>
            
            <svg className='svg' onClick={() => 
                $.post('https://fm_phone/enableCamera')
            } xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M194.6 32H317.4C338.1 32 356.4 45.22 362.9 64.82L373.3 96H448C483.3 96 512 124.7 512 160V416C512 451.3 483.3 480 448 480H64C28.65 480 0 451.3 0 416V160C0 124.7 28.65 96 64 96H138.7L149.1 64.82C155.6 45.22 173.9 32 194.6 32H194.6zM256 384C309 384 352 341 352 288C352 234.1 309 192 256 192C202.1 192 160 234.1 160 288C160 341 202.1 384 256 384z"/></svg>
        
            {
                preview ? (
                    <div className='preview-image'>
                        <img className='img' src={ previewSrc } />
                        <input className='input' maxLength={20} value={ previewLabel } onChange={ handleInput } />

                        <div className='gallery-svgs'>
                            <svg className='svg-action' xmlns="http://www.w3.org/2000/svg" onClick={() => {
                                setPreviewIndex(0)
                                setPreviewEnabled(false)
                            }} viewBox="0 0 512 512"><path d="M480 256c0 123.4-100.5 223.9-223.9 223.9c-48.84 0-95.17-15.58-134.2-44.86c-14.12-10.59-16.97-30.66-6.375-44.81c10.59-14.12 30.62-16.94 44.81-6.375c27.84 20.91 61 31.94 95.88 31.94C344.3 415.8 416 344.1 416 256s-71.69-159.8-159.8-159.8c-37.46 0-73.09 13.49-101.3 36.64l45.12 45.14c17.01 17.02 4.955 46.1-19.1 46.1H35.17C24.58 224.1 16 215.5 16 204.9V59.04c0-24.04 29.07-36.08 46.07-19.07l47.6 47.63C149.9 52.71 201.5 32.11 256.1 32.11C379.5 32.11 480 132.6 480 256z"/></svg>
                            
                            <svg className='svg-action' onClick={() => {
                                saveImage()
                                setPreviewIndex(0)
                                setPreviewEnabled(false)
                            }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M438.6 105.4C451.1 117.9 451.1 138.1 438.6 150.6L182.6 406.6C170.1 419.1 149.9 419.1 137.4 406.6L9.372 278.6C-3.124 266.1-3.124 245.9 9.372 233.4C21.87 220.9 42.13 220.9 54.63 233.4L159.1 338.7L393.4 105.4C405.9 92.88 426.1 92.88 438.6 105.4H438.6z"/></svg>
                            <svg className='svg-action' onClick={() => {
                                deleteImage()
                            }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM394.8 466.1C393.2 492.3 372.3 512 346.9 512H101.1C75.75 512 54.77 492.3 53.19 466.1L31.1 128H416L394.8 466.1z"/></svg>
                        </div>
                    </div>
                ) : (
                    <></>
                )
            }
        </div>
    )
}

export default Gallery 