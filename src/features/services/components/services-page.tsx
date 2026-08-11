"use client";

import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faClock, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Service {
  _id: string;
  name: string;
  description: string;
  pricePerUnit: number;
  minQuantity: number;
  maxQuantity: number;
  estimatedDeliveryHours: number;
  categoryId: Category | null;
  tags: string[];
}

export function ServicesPageContent({ services, categories }: { services: Service[]; categories: Category[] }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = services.filter((service) => {
    const query = search.toLowerCase();
    const matchSearch =
      !query ||
      service.name.toLowerCase().includes(query) ||
      service.description.toLowerCase().includes(query) ||
      service.tags.some((tag) => tag.toLowerCase().includes(query));
    const matchCategory = activeCategory === "all" || service.categoryId?.slug === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="pb-16 pt-24">
      <div className="container">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h1 className="font-display text-4xl font-bold tracking-normal text-navy-900">All services</h1>
          <p className="mt-3 text-muted-foreground">Choose from {services.length} services across all major platforms.</p>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <div className="relative max-w-md flex-1">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search services..." className="pl-9" value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                activeCategory === "all" ? "border-primary bg-blue-50 text-primary" : "border-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => setActiveCategory(category.slug)}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeCategory === category.slug ? "border-primary bg-blue-50 text-primary" : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">No services found.</div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((service) => (
              <Card key={service._id} className="flex flex-col transition-all duration-200 hover:border-blue-200 hover:shadow-card-hover">
                <CardContent className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      {service.categoryId && (
                        <Badge variant="orange" className="mb-2 text-xs">
                          {service.categoryId.name}
                        </Badge>
                      )}
                      <h3 className="font-semibold leading-snug text-navy-900">{service.name}</h3>
                    </div>
                  </div>
                  <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">{service.description}</p>
                  <div className="mb-5 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Per 1,000 units</span>
                      <span className="font-semibold text-navy-900">{formatCurrency(service.pricePerUnit * 1000)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Min / Max</span>
                      <span className="text-foreground">
                        {service.minQuantity.toLocaleString()} - {service.maxQuantity.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <FontAwesomeIcon icon={faClock} className="h-3.5 w-3.5" />
                      Est. {service.estimatedDeliveryHours}h delivery
                    </div>
                  </div>
                  <Button asChild className="mt-auto w-full">
                    <Link href={`/dashboard/orders/new?serviceId=${service._id}`}>
                      Order now
                      <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
