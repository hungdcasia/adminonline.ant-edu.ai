import { useDispatch, useSelector } from "react-redux"
import { themeConst } from "../constants"


function useTheme() {
    const theme = useSelector(state => state.themeState)
    let dispatch = useDispatch()

    const toggleTheme = () => {
        let nextTheme = theme.name == themeConst.dark ? themeConst.light : themeConst.dark;
        localStorage.setItem('theme', nextTheme)
        dispatch({ type: 'SetTheme', name: nextTheme });
    }

    return [toggleTheme]
}

export { useTheme }
