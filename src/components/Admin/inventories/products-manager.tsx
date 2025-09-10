// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Plus, Edit, Search, Grid, List } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import ProductsTable from "./products-table";
// import ProductForm from "./products-form";
// import { useQuery } from "@tanstack/react-query";
// import axiosInstance from "@/utils/fetch-function";
// import useUser from "@/store/userStore";

// export interface Product {
//   productId: string;
//   productName: string;
//   productDescription: string;
//   productCategory: string;
//   productCode: string;
//   productPrice: string;
//   stockQuantity: number;
//   unitQuantity: string;
//   imageURL: string;
//   costPrice: string;
//   storeId: string;
//   barCode: string;
//   brand: string;
//   ccy: string;
// }

// const ProductsManager = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
//   const [viewMode, setViewMode] = useState<"grid" | "table">("table");
//   const {user} = useUser()
//   const { data,isLoading, error } = useQuery({
//     queryKey: ["products"],
//     queryFn: () => {
//       return axiosInstance.request({
//         method: "GET",
//         url: '/ecommerce/products/list',
//         params: {
//           name,
//           storeCode: user?.storeCode,
//           entityCode: user?.entityCode,
//           tag: '',
//           pageNumber: 1,
//           pageSize: 200
//         }
//       })
//       .then(response => response.data)
//     }
//   });

//   console.log(data);

//    if (isLoading) {
//     return (
//       <div className="flex items-center justify-center py-12">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
//           <p className="mt-2 text-muted-foreground">Loading products...</p>
//         </div>
//       </div>
//     );
//   }

//    if (error) {
//     return (
//       <div className="flex items-center justify-center py-12">
//         <div className="text-center">
//           <p className="text-red-500">Error loading products</p>
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
//             placeholder="Search products..."
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

//           <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
//             <DialogTrigger asChild>
//               <Button className="transition-smooth" variant="secondary">
//                 <Plus className="h-4 w-4 mr-2" />
//                 Add Product
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="min-w-[70vw] max-h-[80vh] overflow-y-auto">
//               <DialogHeader>
//                 <DialogTitle></DialogTitle>
//               </DialogHeader>
//               <ProductForm mode="create"/>
//             </DialogContent>
//           </Dialog>
//         </div>
//       </div>

//       {/* Products Content */}
//       {viewMode === "grid" ? (
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {data?.products?.map((product:any) => (
//             <Card key={product.productId} className="group hover:shadow-elegant transition-smooth">
//               <CardHeader className="pb-4">
//                 {product.imageURL && (
//                   <div className="w-full h-48 bg-muted rounded-lg overflow-hidden mb-4">
//                     <img 
//                       src={product.picture} 
//                       alt={product.name}
//                       className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
//                     />
//                   </div>
//                 )}
//                 <CardTitle className="text-lg">{product.name}</CardTitle>
//                 <p className="text-sm text-muted-foreground">Code: {product.code||'NIL'}</p>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-muted-foreground">Price</span>
//                   <span className="font-semibold">{product.ccy} {product.salePrice}</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-muted-foreground">Stock</span>
//                   <span className="font-medium">{product.qtyInStore}</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-muted-foreground">Category</span>
//                   <span className="text-sm">{product.category}</span>
//                 </div>
//                 <Button
//                   variant="secondary"
//                   size="sm"
//                   className="w-full mt-4 bg-accent text-white hover:bg-accent-foreground"
//                   onClick={() => setEditingProduct(product)}
//                 >
//                   <Edit className="h-4 w-4 mr-2" />
//                   Edit Product
//                 </Button>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       ) : (
//         <ProductsTable 
//           products={data?.products || []} 
//           onEdit={setEditingProduct}
//         />
//       )}

//       {/* Edit Dialog */}
//       <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
//         <DialogContent className="min-w-[70vw] max-h-[80vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle></DialogTitle>
//           </DialogHeader>
//           {editingProduct && (
//             <ProductForm 
//               product={editingProduct}
//               mode="edit"
//             />
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Empty State */}
//       {data?.products.length === 0 && (
//         <div className="text-center py-12">
//           <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
//             <Plus className="h-12 w-12 text-muted-foreground" />
//           </div>
//           <h3 className="text-lg font-medium mb-2">No products yet</h3>
//           <p className="text-muted-foreground mb-4">Get started by creating your first product</p>
//           <Button onClick={() => setIsCreateDialogOpen(true)} variant="secondary">
//             <Plus className="h-4 w-4 mr-2" />
//             Add Product
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductsManager;

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Search, Grid, List, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ProductsTable from "./products-table";
import ProductForm from "./products-form";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/fetch-function";
import useUser from "@/store/userStore";
import UploadBulkModal from "../../../app/upload"; // Import the bulk upload modal

export interface Product {
  productId: string;
  productName: string;
  productDescription: string;
  productCategory: string;
  productCode: string;
  productPrice: string;
  stockQuantity: number;
  unitQuantity: string;
  imageURL: string;
  costPrice: string;
  storeId: string;
  barCode: string;
  brand: string;
  ccy: string;
}

const ProductsManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false); // State for bulk upload modal
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const { user } = useUser()
  const { data, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: () => {
      return axiosInstance.request({
        method: "GET",
        url: '/ecommerce/products/list',
        params: {
          name,
          storeCode: user?.storeCode,
          entityCode: user?.entityCode,
          tag: '',
          pageNumber: 1,
          pageSize: 200
        }
      })
        .then(response => response.data)
    }
  });

  console.log(data);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-red-500">Error loading products</p>
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
            placeholder="Search products..."
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
            <DialogContent className=" w-full bg-accent">
              {/* <DialogHeader>
                <DialogTitle></DialogTitle>
              </DialogHeader> */}
              <UploadBulkModal
                open={isBulkUploadOpen}
                onClose={() => setIsBulkUploadOpen(false)}
                uploadType="products"
              />
            </DialogContent>

          </Dialog>
          {/* 
            <Button onClick={() => setIsBulkUploadOpen(true)} variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Bulk Upload
            </Button> */}

          {/* Add Product Button */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="transition-smooth" variant="secondary">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="min-w-[70vw] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Product</DialogTitle>
              </DialogHeader>
              <ProductForm mode="create" />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Products Content */}
      {viewMode === "grid" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data?.products?.map((product: any) => (
            <Card key={product.productId} className="group hover:shadow-elegant transition-smooth">
              <CardHeader className="pb-4">
                {product.imageURL && (
                  <div className="w-full h-48 bg-muted rounded-lg overflow-hidden mb-4">
                    <img
                      src={product.picture}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                    />
                  </div>
                )}
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <p className="text-sm text-muted-foreground">Code: {product.code || 'NIL'}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Price</span>
                  <span className="font-semibold">{product.ccy} {product.salePrice}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Stock</span>
                  <span className="font-medium">{product.qtyInStore}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Category</span>
                  <span className="text-sm">{product.category}</span>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full mt-4 bg-accent text-white hover:bg-accent-foreground"
                  onClick={() => setEditingProduct(product)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Product
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <ProductsTable
          products={data?.products || []}
          onEdit={setEditingProduct}
        />
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent className="min-w-[70vw] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <ProductForm
              product={editingProduct}
              mode="edit"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Bulk Upload Modal */}
      {/* <UploadBulkModal 
        open={isBulkUploadOpen} 
        onClose={() => setIsBulkUploadOpen(false)} 
        uploadType="products" 
      /> */}

      {/* Empty State */}
      {data?.products.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Plus className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No products yet</h3>
          <p className="text-muted-foreground mb-4">Get started by creating your first product</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => setIsCreateDialogOpen(true)} variant="secondary">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
            <Button onClick={() => setIsBulkUploadOpen(true)} variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Bulk Upload
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManager;