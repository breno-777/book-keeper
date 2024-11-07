import Image from 'next/image';
import styles from './apis.module.scss';
import { GoLinkExternal } from 'react-icons/go';
import { IApis } from '@/interfaces/apis.interface';

interface ApiCardProps {
    api: IApis;
}

export const ApiCard = ({ api }: ApiCardProps) => {
    return (
        <div className={styles.container}>
            <Image
                src={api.logo}
                alt={`${api.name} logo`}
                width={64}
                height={64}
                className={styles.icon}
            />
            <div className={styles.api_details}>
                {api.name}
                <div className={styles.buttons_container}>
                    <a href={api.url} target='_blank' rel="noopener noreferrer">
                        Access <GoLinkExternal />
                    </a>
                </div>
            </div>
        </div>
    );
};
