import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Search, Grid, List, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CategoriesTable from "./categories-table";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/fetch-function";
import useUser from "@/store/userStore";
import UploadBulkForm from "../../../app/upload";
import Link from "next/link"; // Import Next.js Link
import CreateCategoryPage from "@/app/(admin)/admin/inventories/create-category/page";

export interface Category {
  id: number;
  code: string;
  name: string;
  description: string;
  sector: string;
  logo: string;
  tags: string;
  topCategory: string;
  qty: string;
}

const CategoriesManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const { user } = useUser();

  const { data, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: () => axiosInstance.request({
      url: '/ecommerce/products/categories',
      params: {
        name: "",
        entityCode: user?.entityCode,
        category: '',
        tag: '',
        pageNumber: 1,
        pageSize: 200
      }
    })
  });

  // Filter categories based on search term
  const filteredCategories = useMemo(() => {
    if (!data?.data?.categories) return [];

    if (!searchTerm) return data.data.categories;

    return data.data.categories.filter((category: Category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.tags.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data?.data?.categories, searchTerm]);

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-red-500">Error loading categories</p>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "table")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="grid" className="flex items-center gap-2">
                <Grid className="h-4 w-4" />
                Grid
              </TabsTrigger>
              <TabsTrigger value="table" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                Table
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Bulk Upload Button */}
          <Dialog open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen}>
            <DialogTrigger asChild>
              <Button className="transition-smooth" variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Bulk Upload
              </Button>
            </DialogTrigger>
            <DialogContent>
              <UploadBulkForm
                uploadType="categories"
                onSuccess={() => setIsBulkUploadOpen(false)}
                onCancel={() => setIsBulkUploadOpen(false)}
              />
            </DialogContent>
          </Dialog>

          {/* Replace Dialog with Link to the new page */}
          <Link href="/admin/inventories/create-category" passHref>
            <Button className="transition-smooth" variant="secondary">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </Link>
        </div>
      </div>

      {/* Rest of your component remains the same */}
      {/* Categories Content */}
      {viewMode === "grid" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((category: Category) => (
            <Card key={category.id} className="group hover:shadow-elegant transition-smooth">
              <CardHeader className="pb-4">
                {category.logo && (
                  <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden mb-4 mx-auto">
                    <img
                      src={category.logo}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <CardTitle className="text-lg text-center">{category.name}</CardTitle>
                <p className="text-sm text-muted-foreground text-center">Code: {category.code}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{category.description}</p>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Sector</span>
                    <Badge variant="secondary">{category.sector}</Badge>
                  </div>

                  {category.topCategory && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Level</span>
                      <span className="text-sm capitalize">{category.topCategory}</span>
                    </div>
                  )}

                  {category.qty && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Quantity</span>
                      <span className="text-sm">{category.qty}</span>
                    </div>
                  )}
                </div>

                {category.tags && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {category.tags.split(',').map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag.trim()}
                      </Badge>
                    ))}
                  </div>
                )}

                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full mt-4 bg-accent text-white hover:bg-accent-foreground"
                  onClick={() => handleEditCategory(category)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Category
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <CategoriesTable
          categories={filteredCategories}
          onEdit={handleEditCategory}
        />
      )}

      {/* Edit Dialog - Keep this for inline editing if needed */}
      <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
        <DialogContent className="min-w-[70vw] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          {editingCategory && (
            <CreateCategoryPage
              category={editingCategory}
              mode="edit"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Empty State */}
      {filteredCategories.length === 0 && !searchTerm && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Plus className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No categories yet</h3>
          <p className="text-muted-foreground mb-4">Get started by creating your first category</p>
          <Link href="/admin/inventories/create-category" passHref>
            <Button variant="secondary">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </Link>
        </div>
      )}

      {/* No Search Results */}
      {filteredCategories.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Search className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No categories found</h3>
          <p className="text-muted-foreground mb-4">
            No categories match your search term "{searchTerm}"
          </p>
          <Button
            onClick={() => setSearchTerm("")}
            variant="secondary"
          >
            Clear Search
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategoriesManager;

// import { useState, useMemo } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Plus, Edit, Search, Grid, List, Upload } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import CategoriesTable from "./categories-table";
// import { useQuery } from "@tanstack/react-query";
// import axiosInstance from "@/utils/fetch-function";
// import useUser from "@/store/userStore";
// import UploadBulkModal from "../../../app/upload";
// import UploadBulkForm from "../../../app/upload";
// import Link from "next/link"; // Import Next.js Link

// export interface Category {
//   id: number;
//   code: string;
//   name: string;
//   description: string;
//   sector: string;
//   logo: string;
//   tags: string;
//   topCategory: string;
//   qty: string;
// }

// const CategoriesManager = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
//   const [editingCategory, setEditingCategory] = useState<Category | null>(null);
//   const [viewMode, setViewMode] = useState<"grid" | "table">("table");
//   const { user } = useUser();

//   const { data, isLoading, error } = useQuery({
//     queryKey: ['categories'],
//     queryFn: () => axiosInstance.request({
//       url: '/ecommerce/products/categories',
//       params: {
//         name: "",
//         entityCode: user?.entityCode,
//         category: '',
//         tag: '',
//         pageNumber: 1,
//         pageSize: 200
//       }
//     })
//   });

//   // Filter categories based on search term
//   const filteredCategories = useMemo(() => {
//     if (!data?.data?.categories) return [];

//     if (!searchTerm) return data.data.categories;

//     return data.data.categories.filter((category: Category) =>
//       category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       category.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       category.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       category.tags.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [data?.data?.categories, searchTerm]);

//   const handleEditCategory = (category: Category) => {
//     setEditingCategory(category);
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center py-12">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
//           <p className="mt-2 text-muted-foreground">Loading categories...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center py-12">
//         <div className="text-center">
//           <p className="text-red-500">Error loading categories</p>
//           <p className="text-muted-foreground">Please try again later</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header Actions */}
//       <div className="flex items-center justify-between">
//         <div className="relative flex-1 max-w-sm">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Search categories..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pl-10"
//           />
//         </div>

//         <div className="flex items-center gap-2">
//           <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "table")}>
//             <TabsList className="grid w-full grid-cols-2">
//               <TabsTrigger value="grid" className="flex items-center gap-2">
//                 <Grid className="h-4 w-4" />
//                 Grid
//               </TabsTrigger>
//               <TabsTrigger value="table" className="flex items-center gap-2">
//                 <List className="h-4 w-4" />
//                 Table
//               </TabsTrigger>
//             </TabsList>
//           </Tabs>

//           {/* Bulk Upload Button */}
//           <Dialog open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen}>
//             <DialogTrigger asChild>
//               <Button className="transition-smooth" variant="outline">
//                 <Upload className="h-4 w-4 mr-2" />
//                 Bulk Upload
//               </Button>
//             </DialogTrigger>
//             <DialogContent>
//               <UploadBulkForm
//                 uploadType="categories"
//                 onSuccess={() => setIsBulkUploadOpen(false)}
//                 onCancel={() => setIsBulkUploadOpen(false)}
//               />
//             </DialogContent>
//           </Dialog>

//           {/* Replace Dialog with Link to the new page */}
//           <Link href="/category-form" passHref>
//             <Button className="transition-smooth" variant="secondary">
//               <Plus className="h-4 w-4 mr-2" />
//               Add Category
//             </Button>
//           </Link>
//         </div>
//       </div>

//       {/* Rest of your component remains the same */}
//       {/* Categories Content */}
//       {viewMode === "grid" ? (
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {filteredCategories.map((category: Category) => (
//             <Card key={category.id} className="group hover:shadow-elegant transition-smooth">
//               <CardHeader className="pb-4">
//                 {category.logo && (
//                   <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden mb-4 mx-auto">
//                     <img
//                       src={category.logo}
//                       alt={category.name}
//                       className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
//                       onError={(e) => {
//                         const target = e.target as HTMLImageElement;
//                         target.style.display = 'none';
//                       }}
//                     />
//                   </div>
//                 )}
//                 <CardTitle className="text-lg text-center">{category.name}</CardTitle>
//                 <p className="text-sm text-muted-foreground text-center">Code: {category.code}</p>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 <p className="text-sm text-muted-foreground">{category.description}</p>

//                 <div className="space-y-2">
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-muted-foreground">Sector</span>
//                     <Badge variant="secondary">{category.sector}</Badge>
//                   </div>

//                   {category.topCategory && (
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm text-muted-foreground">Level</span>
//                       <span className="text-sm capitalize">{category.topCategory}</span>
//                     </div>
//                   )}

//                   {category.qty && (
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm text-muted-foreground">Quantity</span>
//                       <span className="text-sm">{category.qty}</span>
//                     </div>
//                   )}
//                 </div>

//                 {category.tags && (
//                   <div className="flex flex-wrap gap-1 mt-2">
//                     {category.tags.split(',').map((tag, index) => (
//                       <Badge key={index} variant="outline" className="text-xs">
//                         {tag.trim()}
//                       </Badge>
//                     ))}
//                   </div>
//                 )}

//                 <Button
//                   variant="secondary"
//                   size="sm"
//                   className="w-full mt-4 bg-accent text-white hover:bg-accent-foreground"
//                   onClick={() => handleEditCategory(category)}
//                 >
//                   <Edit className="h-4 w-4 mr-2" />
//                   Edit Category
//                 </Button>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       ) : (
//         <CategoriesTable
//           categories={filteredCategories}
//           onEdit={handleEditCategory}
//         />
//       )}

//       {/* Edit Dialog - Keep this for inline editing if needed */}
//       <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
//         <DialogContent className="min-w-[70vw] max-h-[80vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>Edit Category</DialogTitle>
//           </DialogHeader>
//           {/* {editingCategory && (
//             <CategoryForm
//               category={editingCategory}
//               mode="edit"
//               onSuccess={() => setEditingCategory(null)}
//               onCancel={() => setEditingCategory(null)}
//             />
//           )} */}
//         </DialogContent>
//       </Dialog>

//       {/* Empty State */}
//       {filteredCategories.length === 0 && !searchTerm && (
//         <div className="text-center py-12">
//           <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
//             <Plus className="h-12 w-12 text-muted-foreground" />
//           </div>
//           <h3 className="text-lg font-medium mb-2">No categories yet</h3>
//           <p className="text-muted-foreground mb-4">Get started by creating your first category</p>
//           <Link href="/create-category" passHref>
//             <Button variant="secondary">
//               <Plus className="h-4 w-4 mr-2" />
//               Add Category
//             </Button>
//           </Link>
//         </div>
//       )}

//       {/* No Search Results */}
//       {filteredCategories.length === 0 && searchTerm && (
//         <div className="text-center py-12">
//           <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
//             <Search className="h-12 w-12 text-muted-foreground" />
//           </div>
//           <h3 className="text-lg font-medium mb-2">No categories found</h3>
//           <p className="text-muted-foreground mb-4">
//             No categories match your search term "{searchTerm}"
//           </p>
//           <Button
//             onClick={() => setSearchTerm("")}
//             variant="secondary"
//           >
//             Clear Search
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CategoriesManager;