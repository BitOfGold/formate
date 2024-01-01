// DropdownManager.js
import { reactive } from "vue"

const state = reactive({
    openDropdown: null,
})

function setOpenDropdown(dropdown) {
    if (state.openDropdown && state.openDropdown !== dropdown) {
        state.openDropdown.close()
    }
    state.openDropdown = dropdown
}

export default { state, setOpenDropdown }
