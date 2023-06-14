
export function getEnsName() {

    const { data: EnsNameData } = useEnsName({
        address: _data?.teacherAddress,
        chainId: 5
    })

    return (EnsNameData)
}