// import { Request, Response } from 'express';
// import mongoose from 'mongoose';
// import { z } from 'zod';
// import { generateToken } from '../utils/jwt';
// import { hashPassword, comparePassword } from '../utils/hashPassword';
// import HealthCareProvider from '../models/HealthCareProvider';
// import Doctor from '../models/Doctor';
// import Nurse from '../models/Nurse';
// import Lab from '../models/Lab';
// import Physiotherapist from '../models/Physiotherapist';
// import {
//   doctorRegistrationSchema,
//   nurseRegistrationSchema,
//   labRegistrationSchema,
//   physiotherapistRegistrationSchema,
// } from '../validations/providerValidations';

// type DoctorRegistration = z.infer<typeof doctorRegistrationSchema>;
// type NurseRegistration = z.infer<typeof nurseRegistrationSchema>;
// type LabRegistration = z.infer<typeof labRegistrationSchema>;
// type PhysiotherapistRegistration = z.infer<typeof physiotherapistRegistrationSchema>;

// const handleYOEX = (YOEX: string | number): number => {
//   const yoexNumber = Number(YOEX);
//   if (isNaN(yoexNumber)) throw new Error('YOEX must be a valid number');
//   return yoexNumber;
// };

// const buildResponse = (token: string, role: string, provider: any, roleData: any) => ({
//   token,
//   role,
//   provider,
//   roleData,
// });

// // Doctor
// export const registerProviderDoctor = async (req: Request, res: Response) => {
//   const body: DoctorRegistration = req.body;
//   const profileImage = req.file?.path || '';

//   try {
//     const savedProvider = await new HealthCareProvider({
//       ...body,
//       YOEX: handleYOEX(body.YOEX),
//       password: await hashPassword(body.password),
//       image: profileImage,
//       role: 'Doctor',
//     }).save();

//     const doctor = await Doctor.create({
//       provider: savedProvider._id,
//       hospitalOrClinicName: body.hospitalOrClinicName || '',
//       speciality: body.specialization,
//     });

//     const populatedDoctor = await Doctor.findById(doctor._id).populate('provider');
//     const token = await generateToken({ providerId: savedProvider._id.toString(), role: 'Doctor' });
//     res.status(201).json(buildResponse(token, 'Doctor', populatedDoctor?.provider, populatedDoctor));
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error registering doctor', error: err instanceof Error ? err.message : err });
//   }
// };

// // Nurse
// export const registerProviderNurse = async (req: Request, res: Response) => {
//   const body: NurseRegistration = req.body;
//   const profileImage = req.file?.path || '';

//   try {
//     const savedProvider = await new HealthCareProvider({
//       ...body,
//       YOEX: handleYOEX(body.YOEX),
//       password: await hashPassword(body.password),
//       image: profileImage,
//       role: 'Nurse',
//     }).save();

//     const nurse = await Nurse.create({
//       provider: savedProvider._id,
//       companyName: body.companyName || '',
//       specialization: body.specialization,
//       languages: Array.isArray(body.languages)
//         ? body.languages
//         : body.languages?.split(',').map((l: string) => l.trim()),
//     });

//     const populatedNurse = await Nurse.findById(nurse._id).populate('provider');
//     const token = await generateToken({ providerId: savedProvider._id.toString(), role: 'Nurse' });
//     res.status(201).json(buildResponse(token, 'Nurse', populatedNurse?.provider, populatedNurse));
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error registering nurse', error: err instanceof Error ? err.message : err });
//   }
// };

// // Lab
// export const registerProviderLab = async (req: Request, res: Response) => {
//   const body: LabRegistration = req.body;
//   const profileImage = req.file?.path || '';

//   try {
//     const savedProvider = await new HealthCareProvider({
//       ...body,
//       YOEX: handleYOEX(body.YOEX),
//       password: await hashPassword(body.password),
//       image: profileImage,
//       role: 'Lab',
//     }).save();

//     const lab = await Lab.create({
//       provider: savedProvider._id,
//       companyName: body.companyName || '',
//       specialization: body.specialization,
//     });

//     const populatedLab = await Lab.findById(lab._id).populate('provider');
//     const token = await generateToken({ providerId: savedProvider._id.toString(), role: 'Lab' });
//     res.status(201).json(buildResponse(token, 'Lab', populatedLab?.provider, populatedLab));
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error registering lab', error: err instanceof Error ? err.message : err });
//   }
// };

// // Physiotherapist
// export const registerProviderPhysiotherapist = async (req: Request, res: Response) => {
//   const body: PhysiotherapistRegistration = req.body;
//   const profileImage = req.file?.path || '';

//   try {
//     const savedProvider = await new HealthCareProvider({
//       ...body,
//       YOEX: handleYOEX(body.YOEX),
//       password: await hashPassword(body.password),
//       image: profileImage,
//       role: 'Physiotherapist',
//     }).save();

//     const physiotherapist = await Physiotherapist.create({
//       provider: savedProvider._id,
//       companyName: body.companyName || '',
//       specialization: body.specialization,
//     });

//     const populatedPhysio = await Physiotherapist.findById(physiotherapist._id).populate('provider');
//     const token = await generateToken({ providerId: savedProvider._id.toString(), role: 'Physiotherapist' });
//     res.status(201).json(buildResponse(token, 'Physiotherapist', populatedPhysio?.provider, populatedPhysio));
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error registering physiotherapist', error: err instanceof Error ? err.message : err });
//   }
// };

// // Login
// export const loginProvider = async (req: Request, res: Response) => {
//   const { civilID, password } = req.body;

//   try {
//     const provider = await HealthCareProvider.findOne({ civilID });
//     if (!provider) return res.status(404).json({ message: 'Provider not found' });

//     const isMatch = await comparePassword(password, provider.password);
//     if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

//     const token = await generateToken({ providerId: provider._id.toString(), role: provider.role });
//     res.status(200).json({ token, provider });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error logging in', error: err instanceof Error ? err.message : err });
//   }
// };

// // Get all providers
// export const getAllProviders = async (_req: Request, res: Response) => {
//   try {
//     const providers = await HealthCareProvider.find();
//     res.status(200).json(providers);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error fetching providers' });
//   }
// };

// // Get provider by ID
// export const getProviderById = async (req: Request, res: Response) => {
//   const { id } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).json({ message: 'Invalid ID format' });
//   }

//   try {
//     const provider = await HealthCareProvider.findById(id);
//     if (!provider) return res.status(404).json({ message: 'Provider not found' });

//     let roleData = null;
//     switch (provider.role) {
//       case 'Doctor':
//         roleData = await Doctor.findOne({ provider: id }).populate('provider');
//         break;
//       case 'Nurse':
//         roleData = await Nurse.findOne({ provider: id }).populate('provider');
//         break;
//       case 'Lab':
//         roleData = await Lab.findOne({ provider: id }).populate('provider');
//         break;
//       case 'Physiotherapist':
//         roleData = await Physiotherapist.findOne({ provider: id }).populate('provider');
//         break;
//     }

//     res.status(200).json({ provider, roleData });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error fetching provider' });
//   }
// };

// // Update provider
// export const updateProvider = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const updateData = req.body;

//   if (req.file?.path) {
//     updateData.image = req.file.path;
//   }

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).json({ message: 'Invalid ID format' });
//   }

//   try {
//     const provider = await HealthCareProvider.findByIdAndUpdate(id, updateData, { new: true });
//     if (!provider) return res.status(404).json({ message: 'Provider not found' });

//     res.status(200).json(provider);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error updating provider' });
//   }
// };

// // Delete provider
// export const deleteProvider = async (req: Request, res: Response) => {
//   const { id } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).json({ message: 'Invalid ID format' });
//   }

//   try {
//     const provider = await HealthCareProvider.findByIdAndDelete(id);
//     if (!provider) return res.status(404).json({ message: 'Provider not found' });

//     res.status(204).end();
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error deleting provider' });
//   }
// };




// import { Request, Response } from 'express';
// import mongoose from 'mongoose';
// import { z } from 'zod';
// import { generateToken } from '../utils/jwt';
// import { hashPassword, comparePassword } from '../utils/hashPassword';
// import HealthCareProvider from '../models/HealthCareProvider';
// import Doctor from '../models/Doctor';
// import Nurse from '../models/Nurse';
// import Lab from '../models/Lab';
// import Physiotherapist from '../models/Physiotherapist';
// import {
//   doctorRegistrationSchema,
//   nurseRegistrationSchema,
//   labRegistrationSchema,
//   physiotherapistRegistrationSchema,
// } from '../validations/providerValidations';

// type DoctorRegistration = z.infer<typeof doctorRegistrationSchema>;
// type NurseRegistration = z.infer<typeof nurseRegistrationSchema>;
// type LabRegistration = z.infer<typeof labRegistrationSchema>;
// type PhysiotherapistRegistration = z.infer<typeof physiotherapistRegistrationSchema>;

// const handleYOEX = (YOEX: string | number): number => {
//   const yoexNumber = Number(YOEX);
//   if (isNaN(yoexNumber)) throw new Error('YOEX must be a valid number');
//   return yoexNumber;
// };

// const buildFlatResponse = (token: string, role: string, provider: any, roleData: any) => {
//   const flat = {
//     ...provider.toObject?.() || provider,
//     ...roleData.toObject?.() || roleData,
//     role,
//   };
//   delete flat.provider; // remove nested provider reference
//   return { token, user: flat };
// };

// // ♿ Register helper
// const registerHelper = async (
//   req: Request, res: Response,
//   role: 'Doctor' | 'Nurse' | 'Lab' | 'Physiotherapist',
//   Model: any,
//   roleFields: Record<string, any>
// ) => {
//   const body = req.body;
//   const profileImage = req.file?.path || '';
//   try {
//     const savedProvider = await new HealthCareProvider({
//       ...body,
//       YOEX: handleYOEX(body.YOEX),
//       password: await hashPassword(body.password),
//       image: profileImage,
//       role,
//     }).save();

//     const roleDoc = await Model.create({
//       provider: savedProvider._id,
//       ...roleFields
//     });

//     const populatedRoleDoc = await Model.findById(roleDoc._id).populate('provider');
//     const token = await generateToken({ providerId: savedProvider._id.toString(), role });

//     res.status(201).json(buildFlatResponse(token, role, populatedRoleDoc?.provider, populatedRoleDoc));
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: `Error registering ${role.toLowerCase()}`, error: err instanceof Error ? err.message : err });
//   }
// };

// // Doctor
// export const registerProviderDoctor = (req: Request, res: Response) => {
//   registerHelper(req, res, 'Doctor', Doctor, {
//     hospitalOrClinicName: req.body.hospitalOrClinicName || '',
//     speciality: req.body.specialization,
//   });
// };

// // Nurse
// export const registerProviderNurse = (req: Request, res: Response) => {
//   registerHelper(req, res, 'Nurse', Nurse, {
//     companyName: req.body.companyName || '',
//     specialization: req.body.specialization,
//     languages: Array.isArray(req.body.languages) ? req.body.languages : req.body.languages?.split(',').map((l: string) => l.trim()),
//   });
// };

// // Lab
// export const registerProviderLab = (req: Request, res: Response) => {
//   registerHelper(req, res, 'Lab', Lab, {
//     companyName: req.body.companyName || '',
//     specialization: req.body.specialization,
//   });
// };

// // Physiotherapist
// export const registerProviderPhysiotherapist = (req: Request, res: Response) => {
//   registerHelper(req, res, 'Physiotherapist', Physiotherapist, {
//     companyName: req.body.companyName || '',
//     specialization: req.body.specialization,
//   });
// };

// // Login
// export const loginProvider = async (req: Request, res: Response) => {
//   const { civilID, password } = req.body;

//   try {
//     const provider = await HealthCareProvider.findOne({ civilID });
//     if (!provider) return res.status(404).json({ message: 'Provider not found' });

//     const isMatch = await comparePassword(password, provider.password);
//     if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

//     const token = await generateToken({ providerId: provider._id.toString(), role: provider.role });

//     let roleData = null;
//     switch (provider.role) {
//       case 'Doctor':
//         roleData = await Doctor.findOne({ provider: provider._id }).populate('provider');
//         break;
//       case 'Nurse':
//         roleData = await Nurse.findOne({ provider: provider._id }).populate('provider');
//         break;
//       case 'Lab':
//         roleData = await Lab.findOne({ provider: provider._id }).populate('provider');
//         break;
//       case 'Physiotherapist':
//         roleData = await Physiotherapist.findOne({ provider: provider._id }).populate('provider');
//         break;
//     }

//     res.status(200).json(buildFlatResponse(token, provider.role, provider, roleData));
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error logging in', error: err instanceof Error ? err.message : err });
//   }
// };

// // Get all
// export const getAllProviders = async (_req: Request, res: Response) => {
//   try {
//     const providers = await HealthCareProvider.find();
//     res.status(200).json(providers);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error fetching providers' });
//   }
// };

// // Get by ID
// export const getProviderById = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).json({ message: 'Invalid ID format' });
//   }

//   try {
//     const provider = await HealthCareProvider.findById(id);
//     if (!provider) return res.status(404).json({ message: 'Provider not found' });

//     let roleData = null;
//     switch (provider.role) {
//       case 'Doctor':
//         roleData = await Doctor.findOne({ provider: id }).populate('provider');
//         break;
//       case 'Nurse':
//         roleData = await Nurse.findOne({ provider: id }).populate('provider');
//         break;
//       case 'Lab':
//         roleData = await Lab.findOne({ provider: id }).populate('provider');
//         break;
//       case 'Physiotherapist':
//         roleData = await Physiotherapist.findOne({ provider: id }).populate('provider');
//         break;
//     }

//     res.status(200).json(buildFlatResponse('', provider.role, provider, roleData));
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error fetching provider' });
//   }
// };

// // Update
// export const updateProvider = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const updateData = req.body;

//   if (req.file?.path) {
//     updateData.image = req.file.path;
//   }

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).json({ message: 'Invalid ID format' });
//   }

//   try {
//     const provider = await HealthCareProvider.findByIdAndUpdate(id, updateData, { new: true });
//     if (!provider) return res.status(404).json({ message: 'Provider not found' });

//     res.status(200).json(provider);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error updating provider' });
//   }
// };

// // Delete
// export const deleteProvider = async (req: Request, res: Response) => {
//   const { id } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).json({ message: 'Invalid ID format' });
//   }

//   try {
//     const provider = await HealthCareProvider.findByIdAndDelete(id);
//     if (!provider) return res.status(404).json({ message: 'Provider not found' });

//     res.status(204).end();
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error deleting provider' });
//   }
// };

import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import { generateToken } from '../utils/jwt';
import { hashPassword, comparePassword } from '../utils/hashPassword';
import HealthCareProvider from '../models/HealthCareProvider';
import Doctor from '../models/Doctor';
import Nurse from '../models/Nurse';
import Lab from '../models/Lab';

import Physiotherapist from '../models/Physiotherapist';
import {
  doctorRegistrationSchema,
  nurseRegistrationSchema,
  labRegistrationSchema,
  physiotherapistRegistrationSchema,
} from '../validations/providerValidations';

type DoctorRegistration = z.infer<typeof doctorRegistrationSchema>;
type NurseRegistration = z.infer<typeof nurseRegistrationSchema>;
type LabRegistration = z.infer<typeof labRegistrationSchema>;
type PhysiotherapistRegistration = z.infer<typeof physiotherapistRegistrationSchema>;

// ℹ️ Utility
const handleYOEX = (YOEX: string | number): number => {
  const yoexNumber = Number(YOEX);
  if (isNaN(yoexNumber)) throw new Error('YOEX must be a valid number');
  return yoexNumber;
};

// 🚀 Merge Response
const buildMergedUser = (
  token: string,
  role: string,
  populatedRoleDoc: any
) => {
  const provider = populatedRoleDoc?.provider?.toObject?.() || populatedRoleDoc?.provider || {};
  const roleData = populatedRoleDoc?.toObject?.() || populatedRoleDoc || {};

  const user = {
    ...provider,
    ...roleData,
    role,
    token,
  };

  delete user.provider;

  return user;
};

// ♿ Generic Register Helper
const registerHelper = async (
  req: Request,
  res: Response,
  role: 'Doctor' | 'Nurse' | 'Lab' | 'Physiotherapist',
  Model: any
) => {
  const body = req.body;
  const profileImage = req.file?.path || '';

  try {
    const savedProvider = await new HealthCareProvider({
      ...body,
      YOEX: handleYOEX(body.YOEX),
      password: await hashPassword(body.password),
      image: profileImage,
      role,
    }).save();

    const fullRoleData = {
      ...body,
      provider: savedProvider._id,
      image: profileImage,
    };

    const roleDoc = await Model.create(fullRoleData);

    const populatedRoleDoc = await Model.findById(roleDoc._id).populate('provider');
    const token = await generateToken({ providerId: savedProvider._id.toString(), role });

    res.status(201).json(buildMergedUser(token, role, populatedRoleDoc));
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: `Error registering ${role.toLowerCase()}`,
      error: err instanceof Error ? err.message : err,
    });
  }
};

// 🔷 Individual Register Routes
export const registerProviderDoctor = (req: Request, res: Response) =>
  registerHelper(req, res, 'Doctor', Doctor);

export const registerProviderNurse = (req: Request, res: Response) =>
  registerHelper(req, res, 'Nurse', Nurse);

export const registerProviderLab = (req: Request, res: Response) =>
  registerHelper(req, res, 'Lab', Lab);

export const registerProviderPhysiotherapist = (req: Request, res: Response) =>
  registerHelper(req, res, 'Physiotherapist', Physiotherapist);


// 🔑 Login
export const loginProvider = async (req: Request, res: Response) => {
  const { civilID, password } = req.body;

  try {
    const provider = await HealthCareProvider.findOne({ civilID });
    if (!provider) return res.status(404).json({ message: 'Provider not found' });

    const isMatch = await comparePassword(password, provider.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = await generateToken({ providerId: provider._id.toString(), role: provider.role });

    let populatedRoleDoc = null;
    switch (provider.role) {
      case 'Doctor':
        populatedRoleDoc = await Doctor.findOne({ provider: provider._id }).populate('provider');
        break;
      case 'Nurse':
        populatedRoleDoc = await Nurse.findOne({ provider: provider._id }).populate('provider');
        break;
      case 'Lab':
        populatedRoleDoc = await Lab.findOne({ provider: provider._id }).populate('provider');
        break;
      case 'Physiotherapist':
        populatedRoleDoc = await Physiotherapist.findOne({ provider: provider._id }).populate('provider');
        break;
    }

    res.status(200).json(buildMergedUser(token, provider.role, populatedRoleDoc));
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Error logging in',
      error: err instanceof Error ? err.message : err,
    });
  }
};

// 📋 Get By ID
export const getProviderById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    const provider = await HealthCareProvider.findById(id);
    if (!provider) return res.status(404).json({ message: 'Provider not found' });

    let populatedRoleDoc = null;
    switch (provider.role) {
      case 'Doctor':
        populatedRoleDoc = await Doctor.findOne({ provider: id }).populate('provider');
        break;
      case 'Nurse':
        populatedRoleDoc = await Nurse.findOne({ provider: id }).populate('provider');
        break;
      case 'Lab':
        populatedRoleDoc = await Lab.findOne({ provider: id }).populate('provider');
        break;
      case 'Physiotherapist':
        populatedRoleDoc = await Physiotherapist.findOne({ provider: id }).populate('provider');
        break;
    }

    res.status(200).json(buildMergedUser('', provider.role, populatedRoleDoc));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching provider' });
  }
};

// 📋 Get All
export const getAllProviders = async (_req: Request, res: Response) => {
  try {
    const providers = await HealthCareProvider.find();
    res.status(200).json(providers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching providers' });
  }
};

// ✏️ Update
export const updateProvider = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  if (req.file?.path) {
    updateData.image = req.file.path;
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    const provider = await HealthCareProvider.findByIdAndUpdate(id, updateData, { new: true });
    if (!provider) return res.status(404).json({ message: 'Provider not found' });

    res.status(200).json(provider);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating provider' });
  }
};

// 🗑️ Delete
export const deleteProvider = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    const provider = await HealthCareProvider.findByIdAndDelete(id);
    if (!provider) return res.status(404).json({ message: 'Provider not found' });

    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting provider' });
  }
};
