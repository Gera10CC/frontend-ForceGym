import { FormEvent } from "react"
import Swal from 'sweetalert2'
import { Client, ClientDataForm } from "../shared/types"
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication"
import useClientStore from "./Store"
import { useNavigate } from "react-router"
import { formatDate, formatDateFromString } from "../shared/utils/format"

export const useClient = () => {
    const navigate = useNavigate()
    const { clients, fetchClients, deleteClient, deleteClientPermanently, updateClient, changeSearchTerm, changeOrderBy, changeDirectionOrderBy, directionOrderBy } = useClientStore()

    const handleDelete = async ({ idClient, person } : Client) => {
        await Swal.fire({
            title: '¿Desea eliminar este cliente?',
            text: `Está eliminando al cliente ${person.name}`,
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
                const response = await deleteClient(idClient, loggedUser?.idUser as number)

                if(response.ok){
                    Swal.fire({
                        title: 'Cliente eliminado',
                        text: `Se ha eliminado el cliente ${person.name}`,
                        icon: 'success',
                        confirmButtonText: 'OK',
                        timer: 3000,
                        timerProgressBar: true,
                        width: 500,
                        confirmButtonColor: '#CFAD04'
                    })

                    fetchClients()
                }

                if(response.logout){
                    setAuthHeader(null)
                    setAuthUser(null)
                    navigate('/login', {replace: true})
                }
            } 
        })
    }

    const handleDeletePermanently = async ({ idClient, person } : Client) => {
        await Swal.fire({
            title: '¿Desea eliminar PERMANENTEMENTE este cliente?',
            text: `Esta acción eliminará definitivamente al cliente ${person.name} y no se podrá recuperar. Use esta opción solo para registros duplicados o ingresados por error.`,
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            cancelButtonColor: '#bebdbd',
            confirmButtonText: 'Eliminar Permanentemente',
            confirmButtonColor: '#dc2626',
            width: 600,
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                const loggedUser = getAuthUser()
                const response = await deleteClientPermanently(idClient, loggedUser?.idUser as number)

                if(response.ok){
                    Swal.fire({
                        title: 'Cliente eliminado permanentemente',
                        text: `Se ha eliminado permanentemente el cliente ${person.name}`,
                        icon: 'success',
                        confirmButtonText: 'OK',
                        timer: 3000,
                        timerProgressBar: true,
                        width: 500,
                        confirmButtonColor: '#CFAD04'
                    })

                    fetchClients()
                } else if(response.logout){
                    setAuthHeader(null)
                    setAuthUser(null)
                    navigate('/login', {replace: true})
                } else {
                    // Mostrar mensaje de error
                    Swal.fire({
                        title: 'No se puede eliminar',
                        text: response.message || response.error || 'No se pudo eliminar el cliente',
                        icon: 'error',
                        confirmButtonText: 'OK',
                        width: 600,
                        confirmButtonColor: '#CFAD04'
                    })
                }
            } 
        })
    }

    const handleSearch = (e : FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.target as HTMLFormElement
        const { searchTerm } = Object.fromEntries(new FormData(form))
        changeSearchTerm(searchTerm.toString())
    }

    const handleOrderByChange = (orderByTerm : string) => {
        changeOrderBy(orderByTerm)
        changeDirectionOrderBy(directionOrderBy === 'DESC' ? 'ASC' : 'DESC')
    }

    const handleRestore = async (client: ClientDataForm) => {
        const loggedUser = getAuthUser()
        const reqClient = {
            ...client, 
            isDeleted: 0,
            paramLoggedIdUser: loggedUser?.idUser
        }
        
        await Swal.fire({
            title: '¿Desea restaurar este cliente?',
            text: `Está restaurando el cliente ${client.name}`,
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
                const response = await updateClient(reqClient)

                if(response.ok){
                    Swal.fire({
                        title: 'Cliente restaurado',
                        text: `Se ha restaurado el cliente ${client.name}`,
                        icon: 'success',
                        confirmButtonText: 'OK',
                        timer: 3000,
                        timerProgressBar: true,
                        width: 500,
                        confirmButtonColor: '#CFAD04'
                    })
                    
                    fetchClients()
                }

                if(response.logout){
                    setAuthHeader(null)
                    setAuthUser(null)
                    navigate('/login', {replace: true})
                }
            } 
        })
    }

    const pdfTableHeaders = ["#", "Cédula", "Nombre", "Fecha de Registro", "Tipo de Cliente"];
    const pdfTableRows = clients.map((client, index) => [
        index + 1,
        client.person.identificationNumber,
        `${client.person.name} ${client.person.firstLastName} ${client.person.secondLastName}`,
        formatDateFromString(client.registrationDate),
        client.clientType.name
    ]);

    return {
        handleDelete,
        handleDeletePermanently,
        handleSearch,
        handleOrderByChange, 
        handleRestore,
        pdfTableHeaders,
        pdfTableRows
    }
}
