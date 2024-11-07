import { Spinner } from '@/components/spinner'
import styles from './loading.module.scss'

interface LoadingProperties {
    messages?: string;
}
export default function Loading({ messages = 'Checking for updates' }: LoadingProperties) {
    return (
        <div className={styles.container}>
            <Spinner />
            <p className={styles.messages}>{messages}</p>
        </div>
    )
}