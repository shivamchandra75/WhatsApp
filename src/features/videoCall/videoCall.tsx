import type { ReactNode } from "react";
import styles from './videoCall.module.css';
import { Camera, Mic, Phone } from "lucide-react";


export default function VideoCall(): ReactNode {
    return (
        <div className={styles.container}>
            <div className={styles.videoContainer}>
                <video src="">

                </video>
            </div>
            <div className={styles.controls}>
                <button className={styles.controlButton}>
                    <Camera size={24} />
                </button>
                <button className={styles.controlButton}>
                    <Mic size={24} />
                </button>
                <button className={styles.controlButton}>
                    <Phone size={24} />
                </button>
            </div>
        </div>
    );
};