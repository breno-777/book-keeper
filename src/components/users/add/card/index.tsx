import { IoAdd } from "react-icons/io5"
import styles from './addUserCard.module.scss'
import { IUser } from "@/interfaces/user.interface"
import Image from "next/image"
import { useContext } from "react"
import { PageContext } from "@/hooks/context/page/PageContext"
import { MdPerson } from "react-icons/md"

export const AddUserCard = ({ userData }: { userData: IUser | null }) => {
    const context = useContext(PageContext);

    const handleClick = () => {
        if (userData) {
            context?.setUser(userData);
        } else {
            context?.toggleAddUserModal();
        }
    };

    return (
        <div className={styles.container} onClick={() => handleClick()}>
            <div className={styles.user_avatar_container}>
                {userData ? (
                    userData.avatar ? (
                        <Image src='' alt="user_avatar" priority width={94} height={94} />
                    ) : (
                        <div className={styles.icon_avatar_container}>
                            <MdPerson size={48} />
                        </div>
                    )

                ) : (
                    <IoAdd size={46} className={styles.icon} />
                )}
            </div>
            <p className={styles.user_name}>{userData ? userData.name : 'Create new user'} </p>
        </div>
    )
}