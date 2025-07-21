import GlobalLayout from "./views/GlobalLayout";
import Header from "./views/Header";

function App() {
  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
      </div>
      <main className="w-full flex-1 flex min-h-0 p-0 m-0 overflow-hidden">
        <GlobalLayout />
      </main>
    </>
  );
}

export default App;
