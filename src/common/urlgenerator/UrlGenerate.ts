import { Injectable } from '@nestjs/common';

// 1️⃣ Define URL templates type
type UrlTemplateObject = {
  [key: string]: string;
};

// 2️⃣ Type for callable URL functions
type UrlFunctionObject<T extends UrlTemplateObject> = {
  [K in keyof T]: (id: string) => string;
};

@Injectable()
export class UrlGeneratorService {
  // 3️⃣ Proxy object that dynamically returns functions
  private readonly callFunction: UrlFunctionObject<UrlTemplateObject>;

  constructor() {
    const urlTemplates = {
     admin_patient_query_details: `${process.env.FRONT_END_PUBLI_URL}` + "/admin/patient-queries/${id}",
     clinic_request_details: `${process.env.FRONT_END_PUBLI_URL}` + "/partner/requests/${id}"

    } as const;

    // ✅ Fix TS2352 casting issue with `unknown as`
    this.callFunction = new Proxy(urlTemplates, {
      get: (target, prop: string) => {
        const key = prop as keyof typeof urlTemplates;
        return (id: string) => {
          const template = target[key];
          if (!template) throw new Error(`No URL found for '${key as string}'`);
          return template.replace("${id}", id);
        };
      },
    }) as unknown as UrlFunctionObject<typeof urlTemplates>;
  }

  // 4️⃣ Getter to access dynamic URL functions
  get urls(): UrlFunctionObject<UrlTemplateObject> {
    return this.callFunction;
  }
}