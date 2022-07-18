import { useEffect, useState, useRef } from 'react';
import { Copy, Download, File } from 'react-feather';
import LimeService from '../../services/Lime';
import Lime from '../lime';
import ILime from "../../interfaces/Lime";
import Notification, {
    ERROR,
    LOADING,
} from "../notifications/Notification";
import { useDropzone } from "react-dropzone";
import config from '../../config';
import toast from 'react-hot-toast';

function Pampu() {

    const [lime, setLime] = useState<string>("")
    const [limes, setLimes] = useState<ILime[]>([])


    const onDrop = async (acceptedFiles: any) => {
        const formData = new FormData();
        const [file] = acceptedFiles;
        console.log(file.path);
        formData.append("file", file);
        const loadingToast = toast.loading("Uploading file...", LOADING as any);
        try {
            const newLime = await LimeService.addFile(formData)
            setLimes([...limes, newLime])
            toast.dismiss(loadingToast);
        } catch (error: any) {
            console.log(error);
            toast.dismiss(loadingToast);
            toast(
                `Failed to upload file with error: ${error.message}`,
                ERROR as any
            );
        }
    };


    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });



    const lastLimeRef = useRef(null)

    const parseTimestamp = (timestamp: string) => {
        const date = new Date(parseInt(timestamp));
        let parsedDate = `${date.toLocaleString("en-us", { weekday: "short" })} ${date.toLocaleString("en-us", { month: "short" })} ${date.getDate()} ${date.toLocaleTimeString()}`
        return parsedDate;
    }

    const fetchLimes = async () => {
        const loadingToast = toast.loading("Fetching limes...", LOADING as any);
        try {
            const newLimes = await LimeService.fetch()
            setLimes(newLimes)
            // @ts-ignore
            lastLimeRef.current?.scrollIntoView({ behavior: "smooth" })
            toast.dismiss(loadingToast);
        } catch (error: any) {
            console.log(error);
            toast.dismiss(loadingToast);
            toast(
                `Failed to fetch limes with error: ${error.message}`,
                ERROR as any
            );
        }
    }

    useEffect(() => {
        if (!(limes && limes.length > 0)) {
            fetchLimes();
        }
    })

    const handleSendLime = async (expires?: boolean) => {
        if (!lime) {
            return
        }
        const loadingToast = toast.loading("Sending lime...", LOADING as any);
        try {
            console.log("loading...")
            const newLime = await LimeService.add(lime, expires)
            setLimes([...limes, newLime])
            setLime("");
            // @ts-ignore
            lastLimeRef.current?.scrollIntoView({ behavior: "smooth" })
            toast.dismiss(loadingToast);
        } catch (error: any) {
            toast.dismiss(loadingToast);
            console.log(error);
            toast(
                `Failed to send lime with error: ${error.message}`,
                ERROR as any
            );
        }
    }

    const handleCopy = async (content: string) => {
        const loadingToast = toast.loading("copying content...", LOADING as any);
        console.log("copying...")
        await navigator.clipboard.writeText(content);
        console.log("copied!")
        toast.dismiss(loadingToast)
    }

    const handleDownload = async (filename: string, key: string) => {
        try {
            const url = `${config.base}/download/${key}-${filename}`
            window.open(url)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div className="limes-container" >
                {limes && limes.length > 0 ? limes.map((lime, index) => (
                    <div className="lime-container" key={index} ref={((index === limes.length - 1) ? lastLimeRef : null)}>
                        <div className="lime-content">
                            {lime.is_file ?
                                (<>
                                    <div className='file-lime'>
                                        <File size={16} />
                                        <a href={`${config.base}/download/${lime.key}-${lime.content}`}>
                                            <code>{lime.content}</code>
                                        </a>

                                    </div>

                                </>
                                ) :
                                (
                                    <>
                                        <Lime lime={lime.content} />
                                    </>
                                )
                            }
                        </div>
                        <div className="lime-toolbar">
                            <div className="time-tag">
                                {parseTimestamp(lime.key)}
                            </div>
                            <div className="toolbar-actions">
                                <button className="icon-button" onClick={() => handleCopy(lime.content)}>
                                    <Copy size={16} />
                                </button>
                                {lime.is_file && (
                                    <button className="icon-button" onClick={() => handleDownload(lime.content, lime.key)}>
                                        <Download size={16} />
                                    </button>
                                )}

                            </div>

                        </div>
                        <hr />
                    </div>
                )) :
                    (
                        <div>
                            No 🍋's yet, add some
                        </div>
                    )}
            </div>
            <div className="input-container">
                <textarea
                    value={lime}
                    onChange={(event) => {
                        setLime(event.target.value)
                    }} />
                <div className="actions">
                    <button className="send" onClick={() => handleSendLime(false)}>
                        Pampu!! 🍋
                    </button>
                    <abbr title={"expires in 30 mins"}>
                        <button className="send poof" onClick={() => handleSendLime(true)}>
                            Poof 💣💨💥
                        </button>
                    </abbr>
                    <abbr>
                        <div className="dropzone-div" {...getRootProps()}>
                            <input className="dropzone-input" {...getInputProps()} />
                            <div>
                                {isDragActive ? (
                                    <button className="send">drop it!</button>
                                ) : (
                                    <button className="send">
                                        File 📁
                                    </button>
                                )}
                            </div>
                        </div>
                    </abbr>

                </div>

            </div>
            <Notification />
        </>
    )
}

export default Pampu;
