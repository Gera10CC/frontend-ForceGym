import { FormEvent, ReactNode } from "react";
import { CiSearch } from "react-icons/ci";

type SearchInputProps = {
    searchTerm: string
    handleSearch: (e : FormEvent<HTMLFormElement>) => void
    changeSearchType: (newSearchType: number) => void
    children: ReactNode
}

function SearchInput({ searchTerm, handleSearch, changeSearchType, children } : SearchInputProps) {
    const searchingStyles = searchTerm!='' ? 'bg-white text-black ' : 'bg-black text-white '
    
    return (
        <div className="flex items-center gap-8"> 
            <form
                className={'flex items-center w-md px-8 py-2 rounded-full text-lg ' + searchingStyles}
                onSubmit={(e) => handleSearch(e)}
            >
                <input 
                    className="flex-auto mr-16 focus:outline-0"
                    type="text"
                    id="searchTerm"
                    name="searchTerm"
                    placeholder="Buscar por..."
                />   

                <div className="text-sm text-slate-400 mx-2">
                    <select
                    className=""
                        onChange={(e) => {
                            changeSearchType(+e.target.value)
                        }}
                    >
                        <option className="hidden"></option>
                        {children}
                    </select>
                </div>

                <div className="border-l-2 border-slate-400">
                    <button
                        className="ml-2 p-2 rounded-full hover:bg-slate-400 hover:cursor-pointer hover:text-black"
                        type="submit"
                    >
                        <CiSearch/>
                    </button>
                </div>
                
            </form>

        </div>
    );
}

export default SearchInput;