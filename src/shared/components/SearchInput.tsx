import React, { FormEvent, ReactNode } from "react";
import { CiSearch } from "react-icons/ci";

type SearchInputProps = {
    searchTerm: string
    handleSearch: (e : FormEvent<HTMLFormElement>) => void
    changeSearchType: (newSearchType: number) => void
    children: ReactNode
}

function SearchInput({ searchTerm, handleSearch, changeSearchType, children } : SearchInputProps) {
    const searchingStyles = searchTerm !== '' ? 'bg-white text-black ' : 'bg-black text-white '
    
    return (
        <div className="flex items-center gap-8 min-w-0"> 
            <form
                className={'relative flex items-center w-full max-w-[520px] px-4 py-2 rounded-full text-lg ' + searchingStyles}
                onSubmit={(e) => handleSearch(e)}
            >

                <input 
                    className="flex-1 min-w-0 pl-4 pr-12 mr-4 focus:outline-0 bg-transparent"
                    type="text"
                    id="searchTerm"
                    name="searchTerm"
                    placeholder="Buscar por..."
                    defaultValue={searchTerm}
                />   

                <div className="text-sm text-slate-400 ml-2 mr-10 flex-shrink-0">
                    <select
                        onChange={(e) => { changeSearchType(+e.target.value) }}
                    >
                        <option className="hidden"></option>
                        {children}
                    </select>
                </div>


                <button
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full hover:bg-slate-400 hover:cursor-pointer hover:text-black"
                    type="submit"
                >
                    <CiSearch/>
                </button>
            </form>
        </div>
    );
}

export default SearchInput;