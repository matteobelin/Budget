function CreateCategory(){
    return (
        <>
        <form action="">
            <label htmlFor="categoryName">Nom de la catégorie :</label>
            <input type="text" name="categoryName" />
            <label htmlFor="color">Choisir une couleur</label>
            <input type="color" />
        </form>
        </>
    )
}
export default CreateCategory