import {ref} from 'vue'

export  function useDebounce(callback , delay){
        const debounceTimer = ref(null);
        const debouncedfunction=(...args) =>{
            clearTimeout(debounceTimer.value);
            debounceTimer.value = setTimeout( ()=>{
            callback(...args);  
        },delay);
    };
    return debouncedfunction
}
    