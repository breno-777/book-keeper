import styles from './apis.module.scss';
import data from '../../../jsons/apis.json'
import { ApiCard } from '@/components/card/apis';
import { IApis } from '@/interfaces/apis.interface';

export default function Apis() {
    const apis: IApis[] = data;
    return (
        <div className={styles.container}>
            <div className={styles.api_list_container}>
                {apis.map((item, index) => {
                    return (
                        <ApiCard key={index} api={item} />
                    )
                })}
            </div>

        </div>
    )
}