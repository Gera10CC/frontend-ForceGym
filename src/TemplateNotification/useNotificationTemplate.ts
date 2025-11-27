import { FormEvent } from "react"
import Swal from 'sweetalert2'
import { NotificationTemplate, NotificationTemplateDataForm } from "../shared/types"
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication"
import useNotificationTemplateStore from "./Store"
import { useNavigate } from "react-router"

export const useNotificationTemplate = () => {
    const navigate = useNavigate()
    const { fetchNotificationTemplates, deleteNotificationTemplate, updateNotificationTemplate, changeSearchTerm, changeOrderBy, changeDirectionOrderBy, directionOrderBy } = useNotificationTemplateStore()

    const handleDelete = async ({ idNotificationTemplate } : NotificationTemplate) => {
        await Swal.fire({
            title: '¿Desea eliminar esta plantila de notificación?',
            text: `Está eliminando la plantila de notificación`,
            icon: 'question',
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            cancelButtonColor: '#bebdbd',
            confirmButtonText: 'Eliminar',
            confirmButtonColor: '#CFAD04',
            width: 500,
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                const loggedUser = getAuthUser()
                const response = await deleteNotificationTemplate(idNotificationTemplate, loggedUser?.idUser as number)

                if(response.ok){
                    Swal.fire({
                        title: 'Plantilla de notificación eliminada',
                        text: `Se ha eliminado la plantila de notificación ${name}`,
                        icon: 'success',
                        confirmButtonText: 'OK',
                        timer: 3000,
                        timerProgressBar: true,
                        width: 500,
                        confirmButtonColor: '#CFAD04'
                    })

                    fetchNotificationTemplates()
                }

                if(response.logout){
                    setAuthHeader(null)
                    setAuthUser(null)
                    navigate('/login', {replace: true})
                }
            } 
        })
    }

    const handleSearch = (e : FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.target as HTMLFormElement
        const { searchTerm } = Object.fromEntries(new FormData(form))
        useNotificationTemplateStore.setState({ page: 1 })
        changeSearchTerm(searchTerm.toString())
    }

    const handleOrderByChange = (orderByTerm : string) => {
        changeOrderBy(orderByTerm)
        changeDirectionOrderBy(directionOrderBy === 'DESC' ? 'ASC' : 'DESC')
    }

    const handleRestore = async (notificationTemplate: NotificationTemplateDataForm) => {
        const loggedUser = getAuthUser()
        const reqNotificationTemplate = {
            ...notificationTemplate, 
            isDeleted: 0,
            paramLoggedIdUser: loggedUser?.idUser
        }
        
        await Swal.fire({
            title: '¿Desea restaurar esta plantila de notificación?',
            text: `Está restaurando la plantila de notificación `,
            icon: 'question',
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            cancelButtonColor: '#bebdbd',
            confirmButtonText: 'Restaurar',
            confirmButtonColor: '#CFAD04',
            width: 500,
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await updateNotificationTemplate(reqNotificationTemplate)

                if(response.ok){
                    Swal.fire({
                        title: 'Plantila de notificación',
                        text: `Se ha restaurado la plantila de notificación`,
                        icon: 'success',
                        confirmButtonText: 'OK',
                        timer: 3000,
                        timerProgressBar: true,
                        width: 500,
                        confirmButtonColor: '#CFAD04'
                    })
                    
                    fetchNotificationTemplates()
                }

                if(response.logout){
                    setAuthHeader(null)
                    setAuthUser(null)
                    navigate('/login', {replace: true})
                }
            } 
        })
    }

    return {
        handleDelete,
        handleSearch,
        handleOrderByChange, 
        handleRestore
    }
}
