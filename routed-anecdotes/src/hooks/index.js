import { useState } from "react"


export const useField = (type) => {

    const [value, setValue] = useState('')

    const onChange = (event) => {
        setValue(event.target.value)
    }

    const reset = () => {
        console.log('reset')
        setValue('')
    }

    return {
        reset,
        type,
        value,
        onChange
    }
}

export default useField