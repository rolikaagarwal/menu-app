// import CategoryInput from "../components/CategoryInput";
import DisplayList from "../components/DisplayList";
import SearchItems from "../components/SearchItem";
const App: React.FC = () => {
  return (
    <div>
      <h1 className="text-center">welcome to the menu</h1>
      {/* <CategoryInput /> */}
      <SearchItems />
      <DisplayList />
    </div>
  );
};

export default App;
