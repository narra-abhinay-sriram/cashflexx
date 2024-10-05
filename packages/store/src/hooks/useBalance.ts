import { useRecoilValue } from "recoil";
import { balanceatom } from "../atoms/balance";
export const useBalance=()=>{

    const value=useRecoilValue(balanceatom)
    return value
}