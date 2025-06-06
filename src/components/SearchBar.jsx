import { useEffect, useRef, useState } from "react";

const SearchBar = ({ suggestions, onSearch }) => {
    const [input, setInput] = useState("");
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const wrapperRef = useRef(null);

    const handleChange = (e) => {
        const value = e.target.value;
        setInput(value);

        if (!value.trim()) {
            setFilteredSuggestions([]);
            return;
        }

        const matches = suggestions.filter((name) =>
            name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredSuggestions(matches);
    };

    const handleSelect = (name) => {
        setInput(name);
        onSearch(name);
        setFilteredSuggestions([]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(input);
        setFilteredSuggestions([]);
    };

    // Ocultar sugerencias al hacer clic fuera del componente
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setFilteredSuggestions([]);
            }
        };

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setFilteredSuggestions([]);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    return (
        <form onSubmit={handleSubmit} className="w-full" ref={wrapperRef}>
            <input
                type="text"
                placeholder="Nombre del estudiante"
                value={input}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-4 py-2"
            />
            {filteredSuggestions.length > 0 && (
                <ul className="z-10 bg-white border border-gray-300 w-full mt-1 rounded max-h-40 overflow-y-auto">
                    {filteredSuggestions.map((name, index) => (
                        <li
                            key={index}
                            onClick={() => handleSelect(name)}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                            {name}
                        </li>
                    ))}
                </ul>
            )}
        </form>
    );
};

export default SearchBar;