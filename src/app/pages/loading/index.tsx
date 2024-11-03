import { Spinner } from '@/components/spinner'
import styles from './loading.module.scss'

interface LoadingProperties {
    messages: string
}
export function Loading({ messages }: LoadingProperties) {
    return (
        <div className={styles.container}>
            <Spinner />
            <p className={styles.messages}>{messages ? messages : 'Checking for updates'}</p>
        </div>
    )
}