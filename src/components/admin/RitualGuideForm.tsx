"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Upload,
  Check,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Plus,
  Trash2,
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Info
} from "lucide-react";

interface RitualGuideFormProps {
  initialId?: string;
}

interface Step {
  title: string;
  description: string;
  note: string;
  stepTags?: string;
  order: number;
}

interface Mantra {
  devanagari: string;
  transliteration: string;
  meaning: string;
  audioUrl?: string;
}

interface Samagri {
  name: string;
  function: string;
  order: number;
}

interface DPB {
  elementName: string;
  tag: "DHARMA" | "PRATHA" | "BHRANTI";
  confidenceScore: number;
  claim: string;
  correction: string;
  sourceOfTruth: string;
  regionalVariance: string;
}

interface LibrarySource {
  id: string;
  name: string;
  reference: string;
  type: string;
}

interface LibraryFAQ {
  id: string;
  question: string;
  answer: string;
}

export default function RitualGuideForm({ initialId }: RitualGuideFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"basic" | "sankalpa" | "steps" | "mantras" | "katha" | "samagri" | "relations" | "dpb" | "additional">("basic");

  // Form Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  const [category, setCategory] = useState("Festive Pujans");
  const [sankalpaBody, setSankalpaBody] = useState("");
  const [sankalpaQuote, setSankalpaQuote] = useState("");
  const [fastNote, setFastNote] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [kathaTitle, setKathaTitle] = useState("Vrat Katha");
  const [introTitle, setIntroTitle] = useState("");
  const [introDesc, setIntroDesc] = useState("");

  // Panchang fields
  const [panchangAlignment, setPanchangAlignment] = useState("");
  const [panchangObservance, setPanchangObservance] = useState("");
  const [panchangObservanceSub, setPanchangObservanceSub] = useState("");
  const [panchangMuhurta, setPanchangMuhurta] = useState("");
  const [panchangMuhurtaSub, setPanchangMuhurtaSub] = useState("");
  const [panchangTithi, setPanchangTithi] = useState("");
  const [panchangTithiSub, setPanchangTithiSub] = useState("");
  const [panchangVijay, setPanchangVijay] = useState("");
  const [panchangVijaySub, setPanchangVijaySub] = useState("");
  const [panchangNote, setPanchangNote] = useState("");

  // Complex lists
  const [fastOptions, setFastOptions] = useState<{ name: string; desc: string; recommended: boolean }[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [mantras, setMantras] = useState<Mantra[]>([]);
  const [samagriItems, setSamagriItems] = useState<Samagri[]>([]);
  const [dpbEntries, setDpbEntries] = useState<DPB[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedFaqs, setSelectedFaqs] = useState<{ faqId: string; question: string; order: number }[]>([]);

  // Libraries fetched from server
  const [allSources, setAllSources] = useState<LibrarySource[]>([]);
  const [allFaqs, setAllFaqs] = useState<LibraryFAQ[]>([]);

  // New CMS editable fields
  const [heroStoryImage, setHeroStoryImage] = useState("");
  const [heroImageCaption, setHeroImageCaption] = useState("");
  const [narrationAudioFileUrl, setNarrationAudioFileUrl] = useState("");
  const [narrationDuration, setNarrationDuration] = useState("");
  const [narrationLanguage, setNarrationLanguage] = useState("EN");
  const [heroCtaButtons, setHeroCtaButtons] = useState<{ label: string; actionType: string; target: string }[]>([]);

  const [sankalpaWho, setSankalpaWho] = useState("");
  const [sankalpaWhenWhere, setSankalpaWhenWhere] = useState("");
  const [sankalpaForWhat, setSankalpaForWhat] = useState("");
  const [sankalpaLanguageNote, setSankalpaLanguageNote] = useState("");
  const [sankalpaTitle, setSankalpaTitle] = useState("");
  const [sankalpaSub, setSankalpaSub] = useState("");
  const [sankalpaDesc, setSankalpaDesc] = useState("");
  const [vidhiTitle, setVidhiTitle] = useState("");
  const [vidhiSubtitle, setVidhiSubtitle] = useState("");
  const [vidhiMuhuratNote, setVidhiMuhuratNote] = useState("");

  const [nineFormsBannerImage, setNineFormsBannerImage] = useState("");
  const [nineFormsBannerCaption, setNineFormsBannerCaption] = useState("");
  const [nineFormsTable, setNineFormsTable] = useState<{
    dayNumber: number;
    date: string;
    formNameSanskrit: string;
    formNameEnglish: string;
    formIconUrl: string;
    description: string;
    colourName: string;
    colourSwatch: string;
    offering: string;
  }[]>([]);
  const [nineFormsColourNote, setNineFormsColourNote] = useState("");
  const [nineFormsOfferingsNote, setNineFormsOfferingsNote] = useState("");

  const [kathaSourceLabel, setKathaSourceLabel] = useState("");
  const [kathaCardHeadline, setKathaCardHeadline] = useState("");
  const [kathaCardTeaser, setKathaCardTeaser] = useState("");
  const [kathaAudioDuration, setKathaAudioDuration] = useState("");
  const [kathaAudioFileUrl, setKathaAudioFileUrl] = useState("");
  const [kathaSteps, setKathaSteps] = useState<{ stepNumber: number; title: string; description: string }[]>([]);
  const [kathaWhyNineNightsNote, setKathaWhyNineNightsNote] = useState("");

  const [ashtamiNavamiTag, setAshtamiNavamiTag] = useState<"DHARMA" | "PRATHA" | "SHASTRA">("DHARMA");
  const [ashtamiNavamiSandhiNote, setAshtamiNavamiSandhiNote] = useState("");
  const [loadedAshtamiNavamiBody, setLoadedAshtamiNavamiBody] = useState<string | null>(null);
  const [ashtamiNavamiBodyLoaded, setAshtamiNavamiBodyLoaded] = useState(false);

  const [deepDiveTitle, setDeepDiveTitle] = useState("");
  const [deepDiveTeaser, setDeepDiveTeaser] = useState("");
  const [deepDiveConceptId, setDeepDiveConceptId] = useState("");
  const [deepDiveClosingText, setDeepDiveClosingText] = useState("");
  const [loadedDeepDiveBody, setLoadedDeepDiveBody] = useState<string | null>(null);
  const [deepDiveBodyLoaded, setDeepDiveBodyLoaded] = useState(false);

  const [relatedRitualGuides, setRelatedRitualGuides] = useState<{ id: string; badgeTag: string }[]>([]);
  const [relatedPujans, setRelatedPujans] = useState<{ id: string }[]>([]);
  const [relatedConcepts, setRelatedConcepts] = useState<{ id: string }[]>([]);
  const [relatedDates, setRelatedDates] = useState<{ id: string }[]>([]);

  const [preferCareGlobal, setPreferCareGlobal] = useState(true);
  const [kitName, setKitName] = useState("");
  const [kitPrice, setKitPrice] = useState("");
  const [kitDescription, setKitDescription] = useState("");
  const [purohitServiceDescription, setPurohitServiceDescription] = useState("");
  const [tapaCircleDescription, setTapaCircleDescription] = useState("");
  const [showKitCard, setShowKitCard] = useState(true);
  const [showPurohitCard, setShowPurohitCard] = useState(true);
  const [showCircleCard, setShowCircleCard] = useState(true);

  const [allConcepts, setAllConcepts] = useState<{ id: string; title: string }[]>([]);
  const [allGuides, setAllGuides] = useState<{ id: string; title: string }[]>([]);

  // Editor states (Rich Text)
  const [loading, setLoading] = useState(initialId ? true : false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [loadedIntroText, setLoadedIntroText] = useState<string | null>(null);
  const [loadedKathaBody, setLoadedKathaBody] = useState<string | null>(null);
  const [loadedAartiBody, setLoadedAartiBody] = useState<string | null>(null);

  const [introLoaded, setIntroLoaded] = useState(false);
  const [kathaLoaded, setKathaLoaded] = useState(false);
  const [aartiLoaded, setAartiLoaded] = useState(false);

  // Tiptap instances
  const introEditor = useEditor({ extensions: [StarterKit], content: "", immediatelyRender: false });
  const kathaEditor = useEditor({ extensions: [StarterKit], content: "", immediatelyRender: false });
  const aartiEditor = useEditor({ extensions: [StarterKit], content: "", immediatelyRender: false });
  const ashtamiNavamiEditor = useEditor({ extensions: [StarterKit], content: "", immediatelyRender: false });
  const deepDiveEditor = useEditor({ extensions: [StarterKit], content: "", immediatelyRender: false });

  useEffect(() => {
    // Fetch libraries on load
    async function loadLibraries() {
      try {
        const [sourcesRes, faqsRes, conceptsRes, guidesRes] = await Promise.all([
          fetch("/api/admin/sources"),
          fetch("/api/admin/faqs"),
          fetch("/api/admin/dharmic-concepts"),
          fetch("/api/admin/ritual-guides"),
        ]);
        if (sourcesRes.ok) {
          const sData = await sourcesRes.json();
          setAllSources(sData);
        }
        if (faqsRes.ok) {
          const fData = await faqsRes.json();
          setAllFaqs(fData);
        }
        if (conceptsRes.ok) {
          const cData = await conceptsRes.json();
          setAllConcepts(cData);
        }
        if (guidesRes.ok) {
          const gData = await guidesRes.json();
          setAllGuides(gData);
        }
      } catch (e) {
        console.error("Failed to load libraries:", e);
      }
    }
    loadLibraries();

    if (initialId) {
      fetchGuide();
    }
  }, [initialId]);

  async function fetchGuide() {
    try {
      const res = await fetch(`/api/admin/ritual-guides/${initialId}`);
      if (!res.ok) throw new Error("Failed to load guide details");

      const data = await res.json();

      const parseJsonArray = (val: any) => {
        if (!val) return [];
        if (Array.isArray(val)) return val;
        if (typeof val === "string") {
          try {
            const parsed = JSON.parse(val);
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        }
        return [];
      };

      setTitle(data.title);
      setSlug(data.slug);
      setStatus(data.status);
      setCategory(data.category);
      setSankalpaBody(data.sankalpaBody);
      setSankalpaQuote(data.sankalpaQuote);
      setFastNote(data.fastNote);
      setThumbnailUrl(data.thumbnailUrl || "");
      setAudioUrl(data.audioUrl || "");
      setKathaTitle(data.kathaTitle);
      setIntroTitle(data.introTitle || "");
      setIntroDesc(data.introDesc || "");

      setPanchangAlignment(data.panchangAlignment || "");
      setPanchangObservance(data.panchangObservance || "");
      setPanchangObservanceSub(data.panchangObservanceSub || "");
      setPanchangMuhurta(data.panchangMuhurta || "");
      setPanchangMuhurtaSub(data.panchangMuhurtaSub || "");
      setPanchangTithi(data.panchangTithi || "");
      setPanchangTithiSub(data.panchangTithiSub || "");
      setPanchangVijay(data.panchangVijay || "");
      setPanchangVijaySub(data.panchangVijaySub || "");
      setPanchangNote(data.panchangNote || "");

      setFastOptions(parseJsonArray(data.fastOptions));
      setSteps(data.steps || []);
      setMantras(data.mantras || []);
      setSamagriItems(data.samagriItems || []);
      const cleanedDpb = (data.dpbEntries || []).map((entry: any) => {
        let score = entry.confidenceScore;
        if (entry.tag === "DHARMA" && (score < 4 || score > 5)) score = 5;
        else if (entry.tag === "PRATHA" && (score < 2 || score > 3)) score = 3;
        else if (entry.tag === "BHRANTI" && score !== 0) score = 0;
        return { ...entry, confidenceScore: score };
      });
      setDpbEntries(cleanedDpb);
      setSelectedSources(data.sources?.map((s: { sourceId: string }) => s.sourceId) || []);
      setSelectedFaqs(data.faqs?.map((f: { faqId: string; order: number; faq?: { question: string } }) => ({ faqId: f.faqId, question: f.faq?.question || "", order: f.order })) || []);

      setHeroStoryImage(data.heroStoryImage || "");
      setHeroImageCaption(data.heroImageCaption || "");
      setNarrationAudioFileUrl(data.narrationAudioFileUrl || "");
      setNarrationDuration(data.narrationDuration || "");
      setNarrationLanguage(data.narrationLanguage || "EN");
      setHeroCtaButtons(parseJsonArray(data.heroCtaButtons));

      setSankalpaWho(data.sankalpaWho || "");
      setSankalpaWhenWhere(data.sankalpaWhenWhere || "");
      setSankalpaForWhat(data.sankalpaForWhat || "");
      setSankalpaLanguageNote(data.sankalpaLanguageNote || "");
      setSankalpaTitle(data.sankalpaTitle || "");
      setSankalpaSub(data.sankalpaSub || "");
      setSankalpaDesc(data.sankalpaDesc || "");
      setVidhiTitle(data.vidhiTitle || "");
      setVidhiSubtitle(data.vidhiSubtitle || "");
      setVidhiMuhuratNote(data.vidhiMuhuratNote || "");

      setNineFormsBannerImage(data.nineFormsBannerImage || "");
      setNineFormsBannerCaption(data.nineFormsBannerCaption || "");
      setNineFormsTable(parseJsonArray(data.nineFormsTable));
      setNineFormsColourNote(data.nineFormsColourNote || "");
      setNineFormsOfferingsNote(data.nineFormsOfferingsNote || "");

      setKathaSourceLabel(data.kathaSourceLabel || "");
      setKathaCardHeadline(data.kathaCardHeadline || "");
      setKathaCardTeaser(data.kathaCardTeaser || "");
      setKathaAudioDuration(data.kathaAudioDuration || "");
      setKathaAudioFileUrl(data.kathaAudioFileUrl || "");
      setKathaSteps(parseJsonArray(data.kathaSteps));
      setKathaWhyNineNightsNote(data.kathaWhyNineNightsNote || "");

      setAshtamiNavamiTag(data.ashtamiNavamiTag || "DHARMA");
      setAshtamiNavamiSandhiNote(data.ashtamiNavamiSandhiNote || "");
      setLoadedAshtamiNavamiBody(data.ashtamiNavamiBody || "");

      setDeepDiveTitle(data.deepDiveTitle || "");
      setDeepDiveTeaser(data.deepDiveTeaser || "");
      setDeepDiveConceptId(data.deepDiveConceptId || "");
      setDeepDiveClosingText(data.deepDiveClosingText || "");
      setLoadedDeepDiveBody(data.deepDiveBody || "");

      setRelatedRitualGuides(parseJsonArray(data.relatedRitualGuides));
      setRelatedPujans(parseJsonArray(data.relatedPujans));
      setRelatedConcepts(parseJsonArray(data.relatedConcepts));
      setRelatedDates(parseJsonArray(data.relatedDates));

      setPreferCareGlobal(data.preferCareGlobal !== undefined ? data.preferCareGlobal : true);
      setKitName(data.kitName || "");
      setKitPrice(data.kitPrice || "");
      setKitDescription(data.kitDescription || "");
      setPurohitServiceDescription(data.purohitServiceDescription || "");
      setTapaCircleDescription(data.tapaCircleDescription || "");
      setShowKitCard(data.showKitCard !== undefined ? data.showKitCard : true);
      setShowPurohitCard(data.showPurohitCard !== undefined ? data.showPurohitCard : true);
      setShowCircleCard(data.showCircleCard !== undefined ? data.showCircleCard : true);

      setLoadedIntroText(data.introText);
      setLoadedKathaBody(data.kathaBody);
      setLoadedAartiBody(data.aartiBody || "");
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to load guide");
    } finally {
      setLoading(false);
    }
  }

  // Load content into editors once the editors and data are both initialized
  useEffect(() => {
    if (introEditor && loadedIntroText !== null && !introLoaded) {
      try {
        const parsed = JSON.parse(loadedIntroText);
        introEditor.commands.setContent(parsed);
      } catch {
        introEditor.commands.setContent(loadedIntroText);
      }
      setIntroLoaded(true);
    }
  }, [introEditor, loadedIntroText, introLoaded]);

  useEffect(() => {
    if (kathaEditor && loadedKathaBody !== null && !kathaLoaded) {
      try {
        const parsed = JSON.parse(loadedKathaBody);
        kathaEditor.commands.setContent(parsed);
      } catch {
        kathaEditor.commands.setContent(loadedKathaBody);
      }
      setKathaLoaded(true);
    }
  }, [kathaEditor, loadedKathaBody, kathaLoaded]);

  useEffect(() => {
    if (aartiEditor && loadedAartiBody !== null && !aartiLoaded) {
      try {
        const parsed = JSON.parse(loadedAartiBody);
        aartiEditor.commands.setContent(parsed);
      } catch {
        aartiEditor.commands.setContent(loadedAartiBody);
      }
      setAartiLoaded(true);
    }
  }, [aartiEditor, loadedAartiBody, aartiLoaded]);

  useEffect(() => {
    if (ashtamiNavamiEditor && loadedAshtamiNavamiBody !== null && !ashtamiNavamiBodyLoaded) {
      try {
        const parsed = JSON.parse(loadedAshtamiNavamiBody);
        ashtamiNavamiEditor.commands.setContent(parsed);
      } catch {
        ashtamiNavamiEditor.commands.setContent(loadedAshtamiNavamiBody);
      }
      setAshtamiNavamiBodyLoaded(true);
    }
  }, [ashtamiNavamiEditor, loadedAshtamiNavamiBody, ashtamiNavamiBodyLoaded]);

  useEffect(() => {
    if (deepDiveEditor && loadedDeepDiveBody !== null && !deepDiveBodyLoaded) {
      try {
        const parsed = JSON.parse(loadedDeepDiveBody);
        deepDiveEditor.commands.setContent(parsed);
      } catch {
        deepDiveEditor.commands.setContent(loadedDeepDiveBody);
      }
      setDeepDiveBodyLoaded(true);
    }
  }, [deepDiveEditor, loadedDeepDiveBody, deepDiveBodyLoaded]);

  // Handle auto-slugification
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!initialId) {
      const clean = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setSlug(clean);
    }
  };

  // Image Upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setThumbnailUrl(data.url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "File upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleCustomFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setter(data.url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "File upload failed");
    } finally {
      setUploading(false);
    }
  };

  // --- repeatable list helpers ---

  // 1. Fast Options
  const addFastOption = () => {
    if (fastOptions.length >= 3) {
      alert("Typically fasting lists are limited to 3 options max per the spec.");
      return;
    }
    setFastOptions([...fastOptions, { name: "", desc: "", recommended: false }]);
  };
  const removeFastOption = (idx: number) => {
    setFastOptions(fastOptions.filter((_, i) => i !== idx));
  };
  const updateFastOption = (idx: number, fields: Partial<typeof fastOptions[0]>) => {
    const list = [...fastOptions];
    list[idx] = { ...list[idx], ...fields };
    setFastOptions(list);
  };

  // 2. Steps reordering
  const addStep = () => {
    setSteps([...steps, { title: "", description: "", note: "", stepTags: "", order: steps.length + 1 }]);
  };
  const removeStep = (idx: number) => {
    const filtered = steps.filter((_, i) => i !== idx);
    // recalculate orders
    filtered.forEach((s, i) => (s.order = i + 1));
    setSteps(filtered);
  };
  const updateStep = (idx: number, fields: Partial<Step>) => {
    const list = [...steps];
    list[idx] = { ...list[idx], ...fields };
    setSteps(list);
  };
  const moveStep = (idx: number, dir: "up" | "down") => {
    const nextIdx = dir === "up" ? idx - 1 : idx + 1;
    if (nextIdx < 0 || nextIdx >= steps.length) return;
    const list = [...steps];
    const temp = list[idx];
    list[idx] = list[nextIdx];
    list[nextIdx] = temp;
    // reconcile orders
    list.forEach((s, i) => (s.order = i + 1));
    setSteps(list);
  };

  // 3. Mantras
  const addMantra = () => {
    setMantras([...mantras, { devanagari: "", transliteration: "", meaning: "", audioUrl: "" }]);
  };
  const removeMantra = (idx: number) => {
    setMantras(mantras.filter((_, i) => i !== idx));
  };
  const updateMantra = (idx: number, fields: Partial<Mantra>) => {
    const list = [...mantras];
    list[idx] = { ...list[idx], ...fields };
    setMantras(list);
  };

  // 4. Samagri checklist
  const addSamagri = () => {
    setSamagriItems([...samagriItems, { name: "", function: "", order: samagriItems.length + 1 }]);
  };
  const removeSamagri = (idx: number) => {
    const filtered = samagriItems.filter((_, i) => i !== idx);
    filtered.forEach((s, i) => (s.order = i + 1));
    setSamagriItems(filtered);
  };
  const updateSamagri = (idx: number, fields: Partial<Samagri>) => {
    const list = [...samagriItems];
    list[idx] = { ...list[idx], ...fields };
    setSamagriItems(list);
  };
  const moveSamagri = (idx: number, dir: "up" | "down") => {
    const nextIdx = dir === "up" ? idx - 1 : idx + 1;
    if (nextIdx < 0 || nextIdx >= samagriItems.length) return;
    const list = [...samagriItems];
    const temp = list[idx];
    list[idx] = list[nextIdx];
    list[nextIdx] = temp;
    list.forEach((s, i) => (s.order = i + 1));
    setSamagriItems(list);
  };

  // 5. DPB Entries
  const addDpb = () => {
    setDpbEntries([
      ...dpbEntries,
      { elementName: "", tag: "DHARMA", confidenceScore: 5, claim: "", correction: "", sourceOfTruth: "", regionalVariance: "" },
    ]);
  };
  const removeDpb = (idx: number) => {
    setDpbEntries(dpbEntries.filter((_, i) => i !== idx));
  };
  const updateDpb = (idx: number, fields: Partial<DPB>) => {
    const list = [...dpbEntries];
    let score = fields.confidenceScore !== undefined ? fields.confidenceScore : list[idx].confidenceScore;
    
    // Automatically enforce score constraints based on tag selection
    if (fields.tag) {
      if (fields.tag === "DHARMA") score = 5;
      else if (fields.tag === "PRATHA") score = 3;
      else if (fields.tag === "BHRANTI") score = 0;
    }

    list[idx] = { ...list[idx], ...fields, confidenceScore: score };
    setDpbEntries(list);
  };

  // 6. Citations multi-select
  const handleToggleSource = (sourceId: string) => {
    if (selectedSources.includes(sourceId)) {
      setSelectedSources(selectedSources.filter((id) => id !== sourceId));
    } else {
      setSelectedSources([...selectedSources, sourceId]);
    }
  };

  // 7. FAQs multi-select & ordering
  const handleToggleFaq = (faq: LibraryFAQ) => {
    const exists = selectedFaqs.find((f) => f.faqId === faq.id);
    if (exists) {
      const filtered = selectedFaqs.filter((f) => f.faqId !== faq.id);
      filtered.forEach((f, i) => (f.order = i + 1));
      setSelectedFaqs(filtered);
    } else {
      setSelectedFaqs([...selectedFaqs, { faqId: faq.id, question: faq.question, order: selectedFaqs.length + 1 }]);
    }
  };
  const moveFaq = (idx: number, dir: "up" | "down") => {
    const nextIdx = dir === "up" ? idx - 1 : idx + 1;
    if (nextIdx < 0 || nextIdx >= selectedFaqs.length) return;
    const list = [...selectedFaqs];
    const temp = list[idx];
    list[idx] = list[nextIdx];
    list[nextIdx] = temp;
    list.forEach((f, i) => (f.order = i + 1));
    setSelectedFaqs(list);
  };

  // 8. Hero CTA Buttons
  const addHeroCtaButton = () => {
    if (heroCtaButtons.length >= 3) return;
    setHeroCtaButtons([...heroCtaButtons, { label: "", actionType: "Jump to section", target: "" }]);
  };
  const removeHeroCtaButton = (idx: number) => {
    setHeroCtaButtons(heroCtaButtons.filter((_, i) => i !== idx));
  };
  const updateHeroCtaButton = (idx: number, fields: Partial<typeof heroCtaButtons[0]>) => {
    const list = [...heroCtaButtons];
    list[idx] = { ...list[idx], ...fields };
    setHeroCtaButtons(list);
  };

  // 9. Nine Forms Table
  const addNineFormRow = () => {
    if (nineFormsTable.length >= 9) return;
    setNineFormsTable([...nineFormsTable, {
      dayNumber: nineFormsTable.length + 1,
      date: new Date().toISOString().split("T")[0],
      formNameSanskrit: "",
      formNameEnglish: "",
      formIconUrl: "",
      description: "",
      colourName: "",
      colourSwatch: "#ffffff",
      offering: "",
    }]);
  };
  const removeNineFormRow = (idx: number) => {
    const list = nineFormsTable.filter((_, i) => i !== idx);
    list.forEach((row, i) => row.dayNumber = i + 1);
    setNineFormsTable(list);
  };
  const updateNineFormRow = (idx: number, fields: Partial<typeof nineFormsTable[0]>) => {
    const list = [...nineFormsTable];
    list[idx] = { ...list[idx], ...fields };
    setNineFormsTable(list);
  };
  const moveNineFormRow = (idx: number, dir: "up" | "down") => {
    const nextIdx = dir === "up" ? idx - 1 : idx + 1;
    if (nextIdx < 0 || nextIdx >= nineFormsTable.length) return;
    const list = [...nineFormsTable];
    const temp = list[idx];
    list[idx] = list[nextIdx];
    list[nextIdx] = temp;
    list.forEach((row, i) => row.dayNumber = i + 1);
    setNineFormsTable(list);
  };

  // 10. Katha Steps
  const addKathaStep = () => {
    setKathaSteps([...kathaSteps, { stepNumber: kathaSteps.length + 1, title: "", description: "" }]);
  };
  const removeKathaStep = (idx: number) => {
    const list = kathaSteps.filter((_, i) => i !== idx);
    list.forEach((s, i) => s.stepNumber = i + 1);
    setKathaSteps(list);
  };
  const updateKathaStep = (idx: number, fields: Partial<typeof kathaSteps[0]>) => {
    const list = [...kathaSteps];
    list[idx] = { ...list[idx], ...fields };
    setKathaSteps(list);
  };
  const moveKathaStep = (idx: number, dir: "up" | "down") => {
    const nextIdx = dir === "up" ? idx - 1 : idx + 1;
    if (nextIdx < 0 || nextIdx >= kathaSteps.length) return;
    const list = [...kathaSteps];
    const temp = list[idx];
    list[idx] = list[nextIdx];
    list[nextIdx] = temp;
    list.forEach((s, i) => s.stepNumber = i + 1);
    setKathaSteps(list);
  };

  // --- Submit handler ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !slug.trim()) {
      setError("Title and Slug are required.");
      return;
    }

    const introText = introEditor ? JSON.stringify(introEditor.getJSON()) : "";
    const kathaBody = kathaEditor ? JSON.stringify(kathaEditor.getJSON()) : "";
    const aartiBody = aartiEditor ? JSON.stringify(aartiEditor.getJSON()) : "";
    const ashtamiNavamiBody = ashtamiNavamiEditor ? JSON.stringify(ashtamiNavamiEditor.getJSON()) : "";
    const deepDiveBody = deepDiveEditor ? JSON.stringify(deepDiveEditor.getJSON()) : "";

    if (!introText || introText === '{"type":"doc","content":[{"type":"paragraph"}]}') {
      setError("Introduction text is required.");
      return;
    }
    if (!kathaBody || kathaBody === '{"type":"doc","content":[{"type":"paragraph"}]}') {
      setError("Katha body text is required.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const url = initialId ? `/api/admin/ritual-guides/${initialId}` : "/api/admin/ritual-guides";
      const method = initialId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          status,
          category,
          introText,
          introTitle,
          introDesc,
          sankalpaBody,
          sankalpaQuote,
          fastOptions,
          fastNote,
          kathaTitle,
          kathaBody,
          aartiBody,
          thumbnailUrl,
          audioUrl,
          steps,
          mantras,
          samagriItems,
          sources: selectedSources,
          faqs: selectedFaqs.map((f) => ({ faqId: f.faqId, order: f.order })),
          dpbEntries,
          panchangAlignment,
          panchangObservance,
          panchangObservanceSub,
          panchangMuhurta,
          panchangMuhurtaSub,
          panchangTithi,
          panchangTithiSub,
          panchangVijay,
          panchangVijaySub,
          panchangNote,
          heroStoryImage,
          heroImageCaption,
          narrationAudioFileUrl,
          narrationDuration,
          narrationLanguage,
          heroCtaButtons,
          sankalpaWho,
          sankalpaWhenWhere,
          sankalpaForWhat,
          sankalpaLanguageNote,
          sankalpaTitle,
          sankalpaSub,
          sankalpaDesc,
          vidhiTitle,
          vidhiSubtitle,
          vidhiMuhuratNote,
          nineFormsBannerImage,
          nineFormsBannerCaption,
          nineFormsTable,
          nineFormsColourNote,
          nineFormsOfferingsNote,
          kathaSourceLabel,
          kathaCardHeadline,
          kathaCardTeaser,
          kathaAudioDuration,
          kathaAudioFileUrl,
          kathaSteps,
          kathaWhyNineNightsNote,
          ashtamiNavamiBody,
          ashtamiNavamiTag,
          ashtamiNavamiSandhiNote,
          deepDiveTitle,
          deepDiveTeaser,
          deepDiveBody,
          deepDiveConceptId,
          deepDiveClosingText,
          relatedRitualGuides,
          relatedPujans,
          relatedConcepts,
          relatedDates,
          preferCareGlobal,
          kitName,
          kitPrice,
          kitDescription,
          purohitServiceDescription,
          tapaCircleDescription,
          showKitCard,
          showPurohitCard,
          showCircleCard,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");

      router.push("/admin/ritual-guides");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save ritual guide");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-[#C82A54] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-[#8A7A6E] mt-3">Loading guide details...</span>
      </div>
    );
  }

  const TiptapToolbar = ({ editorInstance }: { editorInstance: Editor | null }) => {
    if (!editorInstance) return null;
    return (
      <div className="bg-[#FDFBF7] border-b border-[#EADFC9] p-2 flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => editorInstance.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-lg transition-colors ${editorInstance.isActive("bold") ? "bg-[#FFEAEF] text-[#C82A54]" : "hover:bg-[#F9F5EC]"}`}
        >
          <Bold size={13} />
        </button>
        <button
          type="button"
          onClick={() => editorInstance.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-lg transition-colors ${editorInstance.isActive("italic") ? "bg-[#FFEAEF] text-[#C82A54]" : "hover:bg-[#F9F5EC]"}`}
        >
          <Italic size={13} />
        </button>
        <div className="h-4 w-[1px] bg-[#EADFC9] self-center"></div>
        <button
          type="button"
          onClick={() => editorInstance.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 rounded-lg transition-colors ${editorInstance.isActive("heading", { level: 1 }) ? "bg-[#FFEAEF] text-[#C82A54]" : "hover:bg-[#F9F5EC]"}`}
        >
          <Heading1 size={13} />
        </button>
        <button
          type="button"
          onClick={() => editorInstance.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded-lg transition-colors ${editorInstance.isActive("heading", { level: 2 }) ? "bg-[#FFEAEF] text-[#C82A54]" : "hover:bg-[#F9F5EC]"}`}
        >
          <Heading2 size={13} />
        </button>
        <div className="h-4 w-[1px] bg-[#EADFC9] self-center"></div>
        <button
          type="button"
          onClick={() => editorInstance.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-lg transition-colors ${editorInstance.isActive("bulletList") ? "bg-[#FFEAEF] text-[#C82A54]" : "hover:bg-[#F9F5EC]"}`}
        >
          <List size={13} />
        </button>
        <button
          type="button"
          onClick={() => editorInstance.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded-lg transition-colors ${editorInstance.isActive("orderedList") ? "bg-[#FFEAEF] text-[#C82A54]" : "hover:bg-[#F9F5EC]"}`}
        >
          <ListOrdered size={13} />
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between border-b border-[#F2ECE4] pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/admin/ritual-guides")}
            className="p-2 border border-[#EADFC9] text-[#6A5A4E] hover:bg-[#F9F5EC] rounded-xl transition-all"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="font-serif font-bold text-2xl text-[#3A332C]">
              {initialId ? "Edit Ritual Guide" : "Create New Ritual Guide"}
            </h1>
            <p className="text-xs text-[#8A7A6E] mt-0.5">Compose detail-oriented scriptures and verify content properties.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "DRAFT" | "PUBLISHED")}
            className="text-xs font-bold border border-[#EADFC9] rounded-xl bg-white px-3 py-2 focus:outline-none"
          >
            <option value="DRAFT">DRAFT</option>
            <option value="PUBLISHED">PUBLISHED</option>
          </select>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-[#C82A54] hover:bg-[#B02047] disabled:bg-[#C82A54]/60 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            {submitting ? (
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <Check size={14} />
            )}
            <span>Save Guide</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="text-xs font-semibold text-[#C82A54] bg-[#FFEAEF] p-4 rounded-2xl">
          {error}
        </div>
      )}

      {/* Editor Tabs Navigation */}
      <div className="flex border-b border-[#EADFC9] gap-1 overflow-x-auto select-none">
        {[
          { key: "basic", label: "1. Basic Info & Intro" },
          { key: "sankalpa", label: "2. Sankalpa & Fasting" },
          { key: "steps", label: "3. Vidhi (Steps)" },
          { key: "mantras", label: "4. Mantras" },
          { key: "katha", label: "5. Katha & Aarti" },
          { key: "samagri", label: "6. Samagri Checklist" },
          { key: "relations", label: "7. Sources & FAQs" },
          { key: "dpb", label: "8. DPB Claims Wizard" },
          { key: "additional", label: "9. Additional Details" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2.5 font-semibold text-xs border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? "border-[#C82A54] text-[#C82A54]"
                : "border-transparent text-[#8A7A6E] hover:text-[#3A332C]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Form Body */}
      <div className="bg-white border border-[#EADFC9] rounded-2xl p-6 shadow-sm min-h-[400px]">
        {/* --- Tab 1: Basic & Intro --- */}
        {activeTab === "basic" && (
          <div className="space-y-6">
            <h3 className="font-serif font-bold text-lg border-b border-[#F2ECE4] pb-2 text-[#3A332C]">
              Title & Category Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Maha Rudrabhishek Puja"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#C82A54]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Slug *</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 font-mono focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Category *</label>
                <input
                  type="text"
                  placeholder="e.g. Festive Pujans, Navagraha Pujans"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Thumbnail Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="URL or upload using button on right"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    className="flex-1 text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none"
                  />
                  <label className="cursor-pointer bg-[#FDFBF7] border border-[#EADFC9] text-[#6A5A4E] hover:bg-[#F9F5EC] px-3.5 py-2 rounded-xl flex items-center justify-center">
                    {uploading ? (
                      <span className="w-4 h-4 border-2 border-[#C82A54] border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <Upload size={16} />
                    )}
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Introduction Text (Rich Editor) *</label>
              <div className="border border-[#EADFC9] rounded-2xl overflow-hidden">
                <TiptapToolbar editorInstance={introEditor} />
                <EditorContent editor={introEditor} className="prose max-w-none text-sm p-4 min-h-[160px] bg-white" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Introduction Section Title</label>
                <input
                  type="text"
                  placeholder="e.g. Nine nights, one Mother"
                  value={introTitle}
                  onChange={(e) => setIntroTitle(e.target.value)}
                  className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#C82A54]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Introduction Section Description</label>
                <textarea
                  placeholder="e.g. Navratri means nine nights. It is not nine separate festivals..."
                  value={introDesc}
                  onChange={(e) => setIntroDesc(e.target.value)}
                  rows={2}
                  className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#C82A54]"
                />
              </div>
            </div>
          </div>
        )}

        {/* --- Tab 5: Katha & Aarti --- */}
        {activeTab === "katha" && (
          <div className="space-y-6">
            <div className="border-t border-[#F2ECE4] pt-6 space-y-4">
              <h4 className="font-serif font-bold text-base text-[#3A332C]">Katha and Aarti Texts</h4>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Katha Title *</label>
                <input
                  type="text"
                  value={kathaTitle}
                  onChange={(e) => setKathaTitle(e.target.value)}
                  className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Katha Body Text (Rich Editor) *</label>
                <div className="border border-[#EADFC9] rounded-2xl overflow-hidden">
                  <TiptapToolbar editorInstance={kathaEditor} />
                  <EditorContent editor={kathaEditor} className="prose max-w-none text-sm p-4 min-h-[200px]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Aarti Body Text (Optional, Rich Editor)</label>
                <div className="border border-[#EADFC9] rounded-2xl overflow-hidden">
                  <TiptapToolbar editorInstance={aartiEditor} />
                  <EditorContent editor={aartiEditor} className="prose max-w-none text-sm p-4 min-h-[120px]" />
                </div>
              </div>
              
              {/* Extra Hero Media, Narration & CTA Buttons */}
              <div className="border-t border-[#F2ECE4] pt-6 space-y-4">
                <h4 className="font-serif font-bold text-base text-[#3A332C]">Hero Media & Caption</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Hero Story Image URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="URL or upload using button on right"
                        value={heroStoryImage}
                        onChange={(e) => setHeroStoryImage(e.target.value)}
                        className="flex-1 text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none"
                      />
                      <label className="cursor-pointer bg-[#FDFBF7] border border-[#EADFC9] text-[#6A5A4E] hover:bg-[#F9F5EC] px-3.5 py-2 rounded-xl flex items-center justify-center">
                        {uploading ? (
                          <span className="w-4 h-4 border-2 border-[#C82A54] border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                          <Upload size={16} />
                        )}
                        <input type="file" accept="image/*" onChange={(e) => handleCustomFileUpload(e, setHeroStoryImage)} className="hidden" />
                      </label>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Hero Image Caption</label>
                    <input
                      type="text"
                      placeholder="e.g. Day 1. The kalash is filled..."
                      value={heroImageCaption}
                      onChange={(e) => setHeroImageCaption(e.target.value)}
                      className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-[#F2ECE4] pt-6 space-y-4">
                <h4 className="font-serif font-bold text-base text-[#3A332C]">Audio Narration Block</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Narration Audio File URL</label>
                    <input
                      type="text"
                      placeholder="e.g. https://example.com/audio.mp3"
                      value={narrationAudioFileUrl}
                      onChange={(e) => setNarrationAudioFileUrl(e.target.value)}
                      className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Narration Duration</label>
                    <input
                      type="text"
                      placeholder="e.g. 18 min"
                      value={narrationDuration}
                      onChange={(e) => setNarrationDuration(e.target.value)}
                      className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Narration Language</label>
                    <select
                      value={narrationLanguage}
                      onChange={(e) => setNarrationLanguage(e.target.value)}
                      className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none"
                    >
                      <option value="EN">English (EN)</option>
                      <option value="HI">Hindi (HI)</option>
                      <option value="BOTH">Both (EN & HI)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#F2ECE4] pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-base text-[#3A332C]">Hero CTA Buttons (Max 3)</h4>
                  {heroCtaButtons.length < 3 && (
                    <button
                      type="button"
                      onClick={addHeroCtaButton}
                      className="text-xs font-bold text-[#C82A54] hover:text-[#B02047] flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Button
                    </button>
                  )}
                </div>
                {heroCtaButtons.map((btn, idx) => (
                  <div key={idx} className="bg-[#FDFBF7] border border-[#EADFC9] p-4 rounded-xl space-y-3 relative">
                    <button
                      type="button"
                      onClick={() => removeHeroCtaButton(idx)}
                      className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={15} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#8A7A6E]">Button Label</label>
                        <input
                          type="text"
                          placeholder="e.g. Start with Ghatasthapana"
                          value={btn.label}
                          onChange={(e) => updateHeroCtaButton(idx, { label: e.target.value })}
                          className="w-full text-xs bg-white border border-[#EADFC9] rounded-lg px-3 py-1.5 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#8A7A6E]">Action Type</label>
                        <select
                          value={btn.actionType}
                          onChange={(e) => updateHeroCtaButton(idx, { actionType: e.target.value })}
                          className="w-full text-xs bg-white border border-[#EADFC9] rounded-lg px-3 py-1.5 focus:outline-none"
                        >
                           <option value="Jump to section">Jump to section</option>
                          <option value="External link">External link</option>
                          <option value="Open Ritual Kit">Open Ritual Kit</option>
                          <option value="Open Booking flow">Open Booking flow</option>
                          <option value="Download Card">Download Card</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#8A7A6E]">Target URL or Anchor</label>
                        <input
                          type="text"
                          placeholder="e.g. #vidhi or URL"
                          value={btn.target}
                          onChange={(e) => updateHeroCtaButton(idx, { target: e.target.value })}
                          className="w-full text-xs bg-white border border-[#EADFC9] rounded-lg px-3 py-1.5 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Katha Summary Card section */}
              <div className="border-t border-[#F2ECE4] pt-6 space-y-4">
                <h4 className="font-serif font-bold text-base text-[#3A332C]">Vrat Katha Summary Card UI</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Katha Source Label</label>
                    <input
                      type="text"
                      placeholder="e.g. DEVI MAHATMYA · MARKANDEYA PURANA"
                      value={kathaSourceLabel}
                      onChange={(e) => setKathaSourceLabel(e.target.value)}
                      className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Katha Card Headline</label>
                    <input
                      type="text"
                      placeholder="e.g. The gods were losing, and no god could win"
                      value={kathaCardHeadline}
                      onChange={(e) => setKathaCardHeadline(e.target.value)}
                      className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Katha Card Teaser</label>
                  <textarea
                    placeholder="Short katha summary lines..."
                    value={kathaCardTeaser}
                    onChange={(e) => setKathaCardTeaser(e.target.value)}
                    rows={2}
                    className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Katha Audio Duration</label>
                    <input
                      type="text"
                      placeholder="e.g. 14 min"
                      value={kathaAudioDuration}
                      onChange={(e) => setKathaAudioDuration(e.target.value)}
                      className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Katha Audio File URL</label>
                    <input
                      type="text"
                      placeholder="e.g. https://example.com/katha.mp3"
                      value={kathaAudioFileUrl}
                      onChange={(e) => setKathaAudioFileUrl(e.target.value)}
                      className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between border-t border-[#F2ECE4] pt-4">
                    <h5 className="font-serif font-bold text-sm text-[#3A332C]">Story Steps</h5>
                    <button
                      type="button"
                      onClick={addKathaStep}
                      className="text-xs font-bold text-[#C82A54] hover:text-[#B02047] flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Step
                    </button>
                  </div>
                  {kathaSteps.map((step, idx) => (
                    <div key={idx} className="bg-[#FDFBF7] border border-[#EADFC9] p-4 rounded-xl space-y-3 relative">
                      <div className="absolute top-3 right-3 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => moveKathaStep(idx, "up")}
                          disabled={idx === 0}
                          className="text-[#8A7A6E] hover:text-[#3A332C] disabled:opacity-40"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveKathaStep(idx, "down")}
                          disabled={idx === kathaSteps.length - 1}
                          className="text-[#8A7A6E] hover:text-[#3A332C] disabled:opacity-40"
                        >
                          <ArrowDown size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeKathaStep(idx)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-1.5 col-span-1">
                          <label className="text-xs font-bold text-[#8A7A6E]">Step Number</label>
                          <input
                            type="number"
                            value={step.stepNumber}
                            onChange={(e) => updateKathaStep(idx, { stepNumber: Number(e.target.value) })}
                            className="w-full text-xs bg-white border border-[#EADFC9] rounded-lg px-3 py-1.5 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5 col-span-3">
                          <label className="text-xs font-bold text-[#8A7A6E]">Step Title</label>
                          <input
                            type="text"
                            placeholder="e.g. The boon"
                            value={step.title}
                            onChange={(e) => updateKathaStep(idx, { title: e.target.value })}
                            className="w-full text-xs bg-white border border-[#EADFC9] rounded-lg px-3 py-1.5 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#8A7A6E]">Step Description</label>
                        <textarea
                          placeholder="What happens in this step..."
                          value={step.description}
                          onChange={(e) => updateKathaStep(idx, { description: e.target.value })}
                          rows={2}
                          className="w-full text-xs bg-white border border-[#EADFC9] rounded-lg px-3 py-1.5 focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Why Read Across Nine Nights Note</label>
                  <input
                    type="text"
                    placeholder="e.g. The Devi Mahatmya itself promises: whoever listens to this katha..."
                    value={kathaWhyNineNightsNote}
                    onChange={(e) => setKathaWhyNineNightsNote(e.target.value)}
                    className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- Tab 2: Sankalpa & Fasting --- */}
        {activeTab === "sankalpa" && (
          <div className="space-y-6">
            <h3 className="font-serif font-bold text-lg border-b border-[#F2ECE4] pb-2 text-[#3A332C]">
              Sankalpa Settings
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Sankalpa Section Title</label>
                  <input
                    type="text"
                    placeholder="e.g. The sankalpa"
                    value={sankalpaTitle}
                    onChange={(e) => setSankalpaTitle(e.target.value)}
                    className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Sankalpa Subtitle</label>
                  <input
                    type="text"
                    placeholder="e.g. Said once, at the start, before anything else is done."
                    value={sankalpaSub}
                    onChange={(e) => setSankalpaSub(e.target.value)}
                    className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Sankalpa Explanatory Description</label>
                <textarea
                  placeholder="Explain the meaning or importance of the sankalpa..."
                  value={sankalpaDesc}
                  onChange={(e) => setSankalpaDesc(e.target.value)}
                  rows={2}
                  className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Sankalpa Body Text *</label>
                <textarea
                  placeholder="Explain the scriptural objective of this sankalpa..."
                  value={sankalpaBody}
                  onChange={(e) => setSankalpaBody(e.target.value)}
                  rows={4}
                  className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Sankalpa Quote / Recital Card *</label>
                <textarea
                  placeholder='e.g. "I, [Name], son/daughter of [Fathers Name]..."'
                  value={sankalpaQuote}
                  onChange={(e) => setSankalpaQuote(e.target.value)}
                  rows={3}
                  className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 font-serif text-lg focus:outline-none"
                />
              </div>
            </div>

            <div className="border-t border-[#F2ECE4] pt-6 space-y-4">
              <h4 className="font-serif font-bold text-base text-[#3A332C]">Sankalpa Breakdown Grid</h4>
              <p className="text-[10px] text-[#8A7A6E] mt-0.5">Define the exact breakdown explainer for the WHO / WHEN AND WHERE / FOR WHAT cards.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Who (e.g. The seeker...)</label>
                  <input
                    type="text"
                    value={sankalpaWho}
                    onChange={(e) => setSankalpaWho(e.target.value)}
                    className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">When and Where (e.g. On the soil...)</label>
                  <input
                    type="text"
                    value={sankalpaWhenWhere}
                    onChange={(e) => setSankalpaWhenWhere(e.target.value)}
                    className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">For What (e.g. Strength...)</label>
                  <input
                    type="text"
                    value={sankalpaForWhat}
                    onChange={(e) => setSankalpaForWhat(e.target.value)}
                    className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Sankalpa Language Note (Green Box callout)</label>
                <input
                  type="text"
                  placeholder="e.g. Say it in whatever language you think in..."
                  value={sankalpaLanguageNote}
                  onChange={(e) => setSankalpaLanguageNote(e.target.value)}
                  className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none"
                />
              </div>
            </div>

            <div className="border-t border-[#F2ECE4] pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-base text-[#3A332C]">Fasting Options</h4>
                  <p className="text-[10px] text-[#8A7A6E] mt-0.5">Customize up to 3 fasting variations (e.g. Nirjala, Phalahari).</p>
                </div>
                <button
                  type="button"
                  onClick={addFastOption}
                  className="flex items-center gap-1 bg-[#FDFBF7] border border-[#EADFC9] text-[#6A5A4E] hover:bg-[#F9F5EC] text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
                >
                  <Plus size={12} />
                  <span>Add Option</span>
                </button>
              </div>

              {fastOptions.length === 0 ? (
                <div className="text-xs text-[#8A7A6E] p-4 border border-dashed border-[#EADFC9] rounded-xl text-center">
                  No fasting options added yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {fastOptions.map((opt, idx) => (
                    <div key={idx} className="border border-[#EADFC9] rounded-xl p-4 space-y-3 bg-[#FDFBF7]/30 relative">
                      <button
                        type="button"
                        onClick={() => removeFastOption(idx)}
                        className="absolute top-2 right-2 text-[#8A7A6E] hover:text-[#C82A54]"
                      >
                        <Trash2 size={14} />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-[#8A7A6E]">Option Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Phalahari Vrat"
                            value={opt.name}
                            onChange={(e) => updateFastOption(idx, { name: e.target.value })}
                            className="w-full text-xs bg-white border border-[#EADFC9] rounded-lg px-2.5 py-1.5 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5 flex flex-col justify-end">
                          <label className="flex items-center gap-2 text-xs font-bold text-[#6A5A4E] cursor-pointer pb-2">
                            <input
                              type="checkbox"
                              checked={opt.recommended}
                              onChange={(e) => updateFastOption(idx, { recommended: e.target.checked })}
                              className="rounded border-[#EADFC9] text-[#C82A54] focus:ring-[#C82A54] h-4 w-4"
                            />
                            <span>Recommended Option</span>
                          </label>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#8A7A6E]">Description / Foods Allowed</label>
                        <input
                          type="text"
                          placeholder="e.g. Fruits, milk products, and sabudana khichdi allowed once in evening."
                          value={opt.desc}
                          onChange={(e) => updateFastOption(idx, { desc: e.target.value })}
                          className="w-full text-xs bg-white border border-[#EADFC9] rounded-lg px-2.5 py-1.5 focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider flex items-center gap-1.5">
                  <Info size={14} className="text-[#C82A54]" />
                  <span>Fasting Bhranti Correction / Note</span>
                </label>
                <textarea
                  placeholder="e.g. Note that consuming tea or wheat grains breaks the traditional fast rules..."
                  value={fastNote}
                  onChange={(e) => setFastNote(e.target.value)}
                  rows={2}
                  className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* --- Tab 3: Vidhi (Steps) --- */}
        {activeTab === "steps" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#F2ECE4] pb-2">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#3A332C]">Vidhi (Step-by-Step Guide)</h3>
                <p className="text-[10px] text-[#8A7A6E] mt-0.5">Manage ritual actions in chronological order.</p>
              </div>
            </div>

            <div className="bg-[#FDFBF7]/30 border border-[#EADFC9] rounded-2xl p-5 shadow-sm space-y-4">
              <h4 className="font-serif font-bold text-sm text-[#3A332C] border-b border-[#F2ECE4] pb-1.5">Vidhi Header & Muhurat Settings</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Vidhi Section Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Day 1 — Ghatasthapana"
                    value={vidhiTitle}
                    onChange={(e) => setVidhiTitle(e.target.value)}
                    className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Vidhi Section Subtitle</label>
                  <input
                    type="text"
                    placeholder="e.g. Sunday 11 October · Maa Shailputri..."
                    value={vidhiSubtitle}
                    onChange={(e) => setVidhiSubtitle(e.target.value)}
                    className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Muhurat Alert Note</label>
                <textarea
                  placeholder="e.g. Muhurat. Morning 6:19–10:12 AM is preferred..."
                  value={vidhiMuhuratNote}
                  onChange={(e) => setVidhiMuhuratNote(e.target.value)}
                  rows={2}
                  className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Steps list</span>
              <button
                type="button"
                onClick={addStep}
                className="flex items-center gap-1 bg-[#FDFBF7] border border-[#EADFC9] text-[#6A5A4E] hover:bg-[#F9F5EC] text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
              >
                <Plus size={12} />
                <span>Add Step</span>
              </button>
            </div>

            {steps.length === 0 ? (
              <div className="text-sm text-[#8A7A6E] p-12 border-2 border-dashed border-[#EADFC9] rounded-2xl text-center">
                No steps added yet. Click &quot;Add Step&quot; to begin building the Vidhi.
              </div>
            ) : (
              <div className="space-y-4">
                {steps.map((step, idx) => (
                  <div key={idx} className="bg-[#FDFBF7]/30 border border-[#EADFC9] rounded-2xl p-5 shadow-sm space-y-3 relative group">
                    {/* Controls & Delete */}
                    <div className="absolute top-4 right-4 flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveStep(idx, "up")}
                        className="p-1 hover:bg-[#F9F5EC] text-[#8A7A6E] disabled:opacity-30 rounded"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        disabled={idx === steps.length - 1}
                        onClick={() => moveStep(idx, "down")}
                        className="p-1 hover:bg-[#F9F5EC] text-[#8A7A6E] disabled:opacity-30 rounded"
                      >
                        <ArrowDown size={14} />
                      </button>
                      <div className="h-4 w-[1px] bg-[#EADFC9]"></div>
                      <button
                        type="button"
                        onClick={() => removeStep(idx)}
                        className="p-1 text-[#8A7A6E] hover:text-[#C82A54] rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-[#C82A54] text-white font-bold text-xs rounded-full flex items-center justify-center">
                        {step.order}
                      </span>
                      <span className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Step Details</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5 col-span-1 md:col-span-2">
                        <label className="text-xs font-bold text-[#6A5A4E]">Title *</label>
                        <input
                          type="text"
                          placeholder="e.g. Diya Jalana"
                          value={step.title}
                          onChange={(e) => updateStep(idx, { title: e.target.value })}
                          className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-1.5 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#6A5A4E]">Description *</label>
                      <textarea
                        placeholder="Detailed instructions for the user..."
                        value={step.description}
                        onChange={(e) => updateStep(idx, { description: e.target.value })}
                        rows={3}
                        className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none"
                      />
                    </div>

                                         <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#8A7A6E] flex items-center gap-1">
                        <Info size={12} className="text-[#C82A54]" />
                        <span>Pratha Correction / Step Note</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Lighting Ghee diya is ideal, sesame oil acts as substitute (regional custom)."
                        value={step.note}
                        onChange={(e) => updateStep(idx, { note: e.target.value })}
                        className="w-full text-xs bg-white border border-[#EADFC9] rounded-xl px-3.5 py-1.5 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#8A7A6E]">Step Badges / Tags (comma separated)</label>
                      <input
                        type="text"
                        placeholder="e.g. PRATHA or DHARMA · 4/5, SHASTRA"
                        value={step.stepTags || ""}
                        onChange={(e) => updateStep(idx, { stepTags: e.target.value })}
                        className="w-full text-xs bg-white border border-[#EADFC9] rounded-xl px-3.5 py-1.5 focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- Tab 4: Mantras & Samagri --- */}
        {activeTab === "mantras" && (
          <div className="space-y-8">
            {/* Mantras Repeatable section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#F2ECE4] pb-2">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#3A332C]">Mantras</h3>
                  <p className="text-[10px] text-[#8A7A6E] mt-0.5">Sanskrit chant lists accompanying the rituals.</p>
                </div>
                <button
                  type="button"
                  onClick={addMantra}
                  className="flex items-center gap-1 bg-[#FDFBF7] border border-[#EADFC9] text-[#6A5A4E] hover:bg-[#F9F5EC] text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
                >
                  <Plus size={12} />
                  <span>Add Mantra</span>
                </button>
              </div>

              {mantras.length === 0 ? (
                <div className="text-sm text-[#8A7A6E] p-8 border border-dashed border-[#EADFC9] rounded-xl text-center">
                  No mantras added yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {mantras.map((mantra, idx) => (
                    <div key={idx} className="border border-[#EADFC9] rounded-2xl p-4 bg-[#FDFBF7]/20 relative space-y-3">
                      <button
                        type="button"
                        onClick={() => removeMantra(idx)}
                        className="absolute top-2 right-2 text-[#8A7A6E] hover:text-[#C82A54]"
                      >
                        <Trash2 size={14} />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5 font-serif text-lg">
                          <label className="text-xs font-bold text-[#8A7A6E] font-sans uppercase">Devanagari Input *</label>
                          <textarea
                            placeholder="ॐ भूर् भुवः स्वः..."
                            value={mantra.devanagari}
                            onChange={(e) => updateMantra(idx, { devanagari: e.target.value })}
                            rows={2}
                            className="w-full bg-white border border-[#EADFC9] rounded-xl p-3 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5 italic">
                          <label className="text-xs font-bold text-[#8A7A6E] font-sans uppercase">Transliteration *</label>
                          <textarea
                            placeholder="Om bhur bhuvah svah..."
                            value={mantra.transliteration}
                            onChange={(e) => updateMantra(idx, { transliteration: e.target.value })}
                            rows={2}
                            className="w-full bg-white border border-[#EADFC9] rounded-xl p-3 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#8A7A6E] uppercase">Meaning *</label>
                        <input
                          type="text"
                          placeholder="Literal meaning of this chant..."
                          value={mantra.meaning}
                          onChange={(e) => updateMantra(idx, { meaning: e.target.value })}
                          className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-1.5 focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* --- Tab: Samagri Checklist --- */}
        {activeTab === "samagri" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#F2ECE4] pb-2">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#3A332C]">Samagri Checklist</h3>
                <p className="text-[10px] text-[#8A7A6E] mt-0.5">Item names and corresponding functions needed.</p>
              </div>
              <button
                type="button"
                onClick={addSamagri}
                className="flex items-center gap-1 bg-[#FDFBF7] border border-[#EADFC9] text-[#6A5A4E] hover:bg-[#F9F5EC] text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
              >
                <Plus size={12} />
                <span>Add Samagri Item</span>
              </button>
            </div>

            {samagriItems.length === 0 ? (
              <div className="text-sm text-[#8A7A6E] p-8 border border-dashed border-[#EADFC9] rounded-xl text-center">
                No samagri items added.
              </div>
            ) : (
              <div className="space-y-2.5">
                {samagriItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-[#FDFBF7]/30 border border-[#EADFC9] p-3 rounded-xl relative group">
                    <span className="text-xs font-bold text-[#8A7A6E] w-6 text-center">{item.order}</span>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                      <input
                        type="text"
                        placeholder="Item Name (e.g. Sindoor)"
                        value={item.name}
                        onChange={(e) => updateSamagri(idx, { name: e.target.value })}
                        className="text-xs bg-white border border-[#EADFC9] rounded-lg px-2.5 py-1.5 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Scriptural Function (e.g. Offertory for Parvati Devi)"
                        value={item.function}
                        onChange={(e) => updateSamagri(idx, { function: e.target.value })}
                        className="text-xs bg-white border border-[#EADFC9] rounded-lg px-2.5 py-1.5 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveSamagri(idx, "up")}
                        className="p-1 hover:bg-[#F9F5EC] text-[#8A7A6E] disabled:opacity-30 rounded"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        type="button"
                        disabled={idx === samagriItems.length - 1}
                        onClick={() => moveSamagri(idx, "down")}
                        className="p-1 hover:bg-[#F9F5EC] text-[#8A7A6E] disabled:opacity-30 rounded"
                      >
                        <ArrowDown size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeSamagri(idx)}
                        className="p-1 text-[#8A7A6E] hover:text-[#C82A54] rounded"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- Tab: Additional Details --- */}
        {activeTab === "additional" && (
          <div className="space-y-12">
            {/* Nine Forms of Maa Durga (Navdurga Table) */}
            <div className="space-y-6">
              <h3 className="font-serif font-bold text-lg border-b border-[#F2ECE4] pb-2 text-[#3A332C]">
                Nine Forms of Maa Durga (Navdurga Table)
              </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Nine Forms Banner Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="URL or upload using button on right"
                    value={nineFormsBannerImage}
                    onChange={(e) => setNineFormsBannerImage(e.target.value)}
                    className="flex-1 text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none"
                  />
                  <label className="cursor-pointer bg-[#FDFBF7] border border-[#EADFC9] text-[#6A5A4E] hover:bg-[#F9F5EC] px-3.5 py-2 rounded-xl flex items-center justify-center">
                    {uploading ? (
                      <span className="w-4 h-4 border-2 border-[#C82A54] border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <Upload size={16} />
                    )}
                    <input type="file" accept="image/*" onChange={(e) => handleCustomFileUpload(e, setNineFormsBannerImage)} className="hidden" />
                  </label>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Banner Caption</label>
                <input
                  type="text"
                  placeholder="e.g. One Shakti, nine faces..."
                  value={nineFormsBannerCaption}
                  onChange={(e) => setNineFormsBannerCaption(e.target.value)}
                  className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none"
                />
              </div>
            </div>

            <div className="border-t border-[#F2ECE4] pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-serif font-bold text-base text-[#3A332C]">Nine Forms Table (exactly 9 rows)</h4>
                {nineFormsTable.length < 9 && (
                  <button
                    type="button"
                    onClick={addNineFormRow}
                    className="text-xs font-bold text-[#C82A54] hover:text-[#B02047] flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Day Row
                  </button>
                )}
              </div>
              {nineFormsTable.map((row, idx) => (
                <div key={idx} className="bg-[#FDFBF7] border border-[#EADFC9] p-4 rounded-xl space-y-3 relative">
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => moveNineFormRow(idx, "up")}
                      disabled={idx === 0}
                      className="text-[#8A7A6E] hover:text-[#3A332C] disabled:opacity-40"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveNineFormRow(idx, "down")}
                      disabled={idx === nineFormsTable.length - 1}
                      className="text-[#8A7A6E] hover:text-[#3A332C] disabled:opacity-40"
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeNineFormRow(idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#8A7A6E]">Day Number</label>
                      <input
                        type="number"
                        min="1"
                        max="9"
                        value={row.dayNumber}
                        onChange={(e) => updateNineFormRow(idx, { dayNumber: Number(e.target.value) })}
                        className="w-full text-xs bg-white border border-[#EADFC9] rounded-lg px-3 py-1.5 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#8A7A6E]">Date</label>
                      <input
                        type="date"
                        value={row.date}
                        onChange={(e) => updateNineFormRow(idx, { date: e.target.value })}
                        className="w-full text-xs bg-white border border-[#EADFC9] rounded-lg px-3 py-1.5 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#8A7A6E]">Form Name (Sanskrit)</label>
                      <input
                        type="text"
                        placeholder="e.g. Shailaputri"
                        value={row.formNameSanskrit}
                        onChange={(e) => updateNineFormRow(idx, { formNameSanskrit: e.target.value })}
                        className="w-full text-xs bg-white border border-[#EADFC9] rounded-lg px-3 py-1.5 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#8A7A6E]">Form Name (English)</label>
                      <input
                        type="text"
                        placeholder="e.g. Daughter of the mountain"
                        value={row.formNameEnglish}
                        onChange={(e) => updateNineFormRow(idx, { formNameEnglish: e.target.value })}
                        className="w-full text-xs bg-white border border-[#EADFC9] rounded-lg px-3 py-1.5 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1.5 col-span-2">
                      <label className="text-xs font-bold text-[#8A7A6E]">Description</label>
                      <input
                        type="text"
                        placeholder="Short description..."
                        value={row.description}
                        onChange={(e) => updateNineFormRow(idx, { description: e.target.value })}
                        className="w-full text-xs bg-white border border-[#EADFC9] rounded-lg px-3 py-1.5 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#8A7A6E]">Colour Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Royal Blue"
                        value={row.colourName}
                        onChange={(e) => updateNineFormRow(idx, { colourName: e.target.value })}
                        className="w-full text-xs bg-white border border-[#EADFC9] rounded-lg px-3 py-1.5 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#8A7A6E]">Colour Swatch (Hex)</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={row.colourSwatch}
                          onChange={(e) => updateNineFormRow(idx, { colourSwatch: e.target.value })}
                          className="h-8 w-8 rounded cursor-pointer border border-[#EADFC9]"
                        />
                        <input
                          type="text"
                          value={row.colourSwatch}
                          onChange={(e) => updateNineFormRow(idx, { colourSwatch: e.target.value })}
                          className="flex-1 text-xs bg-white border border-[#EADFC9] rounded-lg px-2 py-1.5 focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#8A7A6E]">Offering</label>
                      <input
                        type="text"
                        placeholder="e.g. Cow's ghee"
                        value={row.offering}
                        onChange={(e) => updateNineFormRow(idx, { offering: e.target.value })}
                        className="w-full text-xs bg-white border border-[#EADFC9] rounded-lg px-3 py-1.5 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#8A7A6E]">Form Icon Image URL</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="URL or upload"
                          value={row.formIconUrl}
                          onChange={(e) => updateNineFormRow(idx, { formIconUrl: e.target.value })}
                          className="flex-1 text-xs bg-white border border-[#EADFC9] rounded-lg px-3 py-1.5 focus:outline-none"
                        />
                        <label className="cursor-pointer bg-[#FDFBF7] border border-[#EADFC9] text-[#6A5A4E] hover:bg-[#F9F5EC] px-3 py-1.5 rounded-lg flex items-center justify-center text-xs">
                          <Upload size={12} />
                          <input type="file" accept="image/*" onChange={(e) => handleCustomFileUpload(e, (url) => updateNineFormRow(idx, { formIconUrl: url }))} className="hidden" />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            }
            </div>

            <div className="border-t border-[#F2ECE4] pt-6 space-y-4">
              <h4 className="font-serif font-bold text-base text-[#3A332C]">Disclaimer Notes</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Colour System Note (PRATHA Correction)</label>
                  <textarea
                    placeholder="e.g. The daily colour system is popular... not scriptural"
                    value={nineFormsColourNote}
                    onChange={(e) => setNineFormsColourNote(e.target.value)}
                    rows={2}
                    className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Offerings Note (PRATHA Correction)</label>
                  <textarea
                    placeholder="e.g. The day-specific offerings... vary by family"
                    value={nineFormsOfferingsNote}
                    onChange={(e) => setNineFormsOfferingsNote(e.target.value)}
                    rows={2}
                    className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* --- Tab: Ashtami & Navami --- */}
          <div className="space-y-6 border-t border-[#F2ECE4] pt-8">
            <h3 className="font-serif font-bold text-lg border-b border-[#F2ECE4] pb-2 text-[#3A332C]">
              Durga Ashtami and Maha Navami Details
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Section Body Text (Rich Editor)</label>
              <div className="border border-[#EADFC9] rounded-2xl overflow-hidden bg-white">
                <TiptapToolbar editorInstance={ashtamiNavamiEditor} />
                <EditorContent editor={ashtamiNavamiEditor} className="prose max-w-none text-sm p-4 min-h-[200px]" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Tag Classification</label>
                <select
                  value={ashtamiNavamiTag}
                  onChange={(e) => setAshtamiNavamiTag(e.target.value as any)}
                  className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none"
                >
                  <option value="DHARMA">DHARMA</option>
                  <option value="PRATHA">PRATHA</option>
                  <option value="SHASTRA">SHASTRA</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Sandhi Puja Note</label>
                <input
                  type="text"
                  placeholder="e.g. The meeting point of the tithis..."
                  value={ashtamiNavamiSandhiNote}
                  onChange={(e) => setAshtamiNavamiSandhiNote(e.target.value)}
                  className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none"
                />
              </div>
            </div>

            {/* Deep-Dive Panel Settings (Why nine nights?) */}
            <div className="space-y-6 border-t border-[#F2ECE4] pt-8">
              <h3 className="font-serif font-bold text-lg border-b border-[#F2ECE4] pb-2 text-[#3A332C]">
                Deep-Dive Panel Settings (Why nine nights?)
              </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Panel Title</label>
                <input
                  type="text"
                  placeholder="e.g. Why nine nights?"
                  value={deepDiveTitle}
                  onChange={(e) => setDeepDiveTitle(e.target.value)}
                  className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Panel Teaser</label>
                <input
                  type="text"
                  placeholder="e.g. The number is not decorative"
                  value={deepDiveTeaser}
                  onChange={(e) => setDeepDiveTeaser(e.target.value)}
                  className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Panel Body Text (Rich Editor)</label>
              <div className="border border-[#EADFC9] rounded-2xl overflow-hidden bg-white">
                <TiptapToolbar editorInstance={deepDiveEditor} />
                <EditorContent editor={deepDiveEditor} className="prose max-w-none text-sm p-4 min-h-[200px]" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Related Concept Link</label>
                <select
                  value={deepDiveConceptId}
                  onChange={(e) => setDeepDiveConceptId(e.target.value)}
                  className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none"
                >
                  <option value="">-- Select Dharmic Concept --</option>
                  {allConcepts.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Closing Reflection Text (Dark Card)</label>
                <input
                  type="text"
                  placeholder="e.g. Navratri is the tradition's most sustained worship..."
                  value={deepDiveClosingText}
                  onChange={(e) => setDeepDiveClosingText(e.target.value)}
                  className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none"
                />
              </div>
            </div>

            {/* Related Content Pickers */}
            <div className="space-y-6 border-t border-[#F2ECE4] pt-8">
              <h3 className="font-serif font-bold text-lg border-b border-[#F2ECE4] pb-2 text-[#3A332C]">
                Related Content Pickers
              </h3>

            {/* Related Guides Selector */}
            <div className="space-y-3 border-b border-[#F2ECE4] pb-4">
              <h4 className="font-serif font-bold text-sm text-[#3A332C]">Related Ritual Guides (max 4)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allGuides.filter((g) => g.id !== initialId).map((guide) => {
                  const selection = relatedRitualGuides.find((item) => item.id === guide.id);
                  return (
                    <div key={guide.id} className="flex items-center justify-between border border-[#EADFC9] rounded-xl p-3 bg-[#FDFBF7]/30">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#3A332C]">
                        <input
                          type="checkbox"
                          checked={!!selection}
                          onChange={(e) => {
                            if (e.target.checked) {
                              if (relatedRitualGuides.length >= 4) {
                                alert("Maximum 4 related guides allowed.");
                                return;
                              }
                              setRelatedRitualGuides([...relatedRitualGuides, { id: guide.id, badgeTag: "" }]);
                            } else {
                              setRelatedRitualGuides(relatedRitualGuides.filter((item) => item.id !== guide.id));
                            }
                          }}
                          className="rounded border-[#EADFC9] text-[#C82A54] focus:ring-[#C82A54] h-4 w-4"
                        />
                        <span>{guide.title}</span>
                      </label>
                      {selection && (
                        <input
                          type="text"
                          placeholder="e.g. CALENDAR"
                          value={selection.badgeTag}
                          onChange={(e) => {
                            setRelatedRitualGuides(relatedRitualGuides.map((item) => item.id === guide.id ? { ...item, badgeTag: e.target.value } : item));
                          }}
                          className="text-[10px] w-24 bg-white border border-[#EADFC9] rounded px-2 py-1 focus:outline-none"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Related Concepts Selector */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-sm text-[#3A332C]">Related Dharmic Concepts</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {allConcepts.map((concept) => {
                  const isChecked = relatedConcepts.some((c) => c.id === concept.id);
                  return (
                    <label key={concept.id} className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#3A332C] border border-[#EADFC9] rounded-xl p-3 bg-[#FDFBF7]/30">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setRelatedConcepts([...relatedConcepts, { id: concept.id }]);
                          } else {
                            setRelatedConcepts(relatedConcepts.filter((c) => c.id !== concept.id));
                          }
                        }}
                        className="rounded border-[#EADFC9] text-[#C82A54] focus:ring-[#C82A54] h-4 w-4"
                      />
                      <span>{concept.title}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Companion Cards & Overrides */}
            <div className="space-y-6 border-t border-[#F2ECE4] pt-8">
              <h3 className="font-serif font-bold text-lg border-b border-[#F2ECE4] pb-2 text-[#3A332C]">
                Companion Cards & Overrides
              </h3>

            <div className="bg-[#FDFBF7] border border-[#EADFC9] rounded-xl p-4 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-[#3A332C]">Use global defaults</h4>
                <p className="text-[10px] text-[#8A7A6E]">Check to reuse site-wide cards (Shakti Kit, Purohit booking, Tap Circle).</p>
              </div>
              <input
                type="checkbox"
                checked={preferCareGlobal}
                onChange={(e) => setPreferCareGlobal(e.target.checked)}
                className="rounded border-[#EADFC9] text-[#C82A54] focus:ring-[#C82A54] h-5 w-5"
              />
            </div>

            {!preferCareGlobal && (
              <div className="space-y-6 border-t border-[#F2ECE4] pt-6">
                {/* Custom Shakti Kit Card */}
                <div className="space-y-4 border border-[#EADFC9] p-4 rounded-xl bg-white">
                  <div className="flex items-center justify-between border-b border-[#F2ECE4] pb-2">
                    <h4 className="font-serif font-bold text-sm text-[#3A332C]">1. Shakti Ritual Kit Card</h4>
                    <input
                      type="checkbox"
                      checked={showKitCard}
                      onChange={(e) => setShowKitCard(e.target.checked)}
                      className="rounded border-[#EADFC9] text-[#C82A54] focus:ring-[#C82A54] h-4 w-4"
                    />
                  </div>
                  {showKitCard && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#8A7A6E]">Kit Override Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Navratri Companion Kit"
                          value={kitName}
                          onChange={(e) => setKitName(e.target.value)}
                          className="w-full text-xs bg-white border border-[#EADFC9] rounded-lg px-3 py-1.5 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#8A7A6E]">Kit Price Override</label>
                        <input
                          type="text"
                          placeholder="e.g. ₹1,499"
                          value={kitPrice}
                          onChange={(e) => setKitPrice(e.target.value)}
                          className="w-full text-xs bg-white border border-[#EADFC9] rounded-lg px-3 py-1.5 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5 col-span-2">
                        <label className="text-xs font-bold text-[#8A7A6E]">Kit Description Override</label>
                        <textarea
                          placeholder="What is included in the kit..."
                          value={kitDescription}
                          onChange={(e) => setKitDescription(e.target.value)}
                          rows={2}
                          className="w-full text-xs bg-white border border-[#EADFC9] rounded-lg px-3 py-1.5 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Custom Purohit booking Card */}
                <div className="space-y-4 border border-[#EADFC9] p-4 rounded-xl bg-white">
                  <div className="flex items-center justify-between border-b border-[#F2ECE4] pb-2">
                    <h4 className="font-serif font-bold text-sm text-[#3A332C]">2. Book a Purohit Card</h4>
                    <input
                      type="checkbox"
                      checked={showPurohitCard}
                      onChange={(e) => setShowPurohitCard(e.target.checked)}
                      className="rounded border-[#EADFC9] text-[#C82A54] focus:ring-[#C82A54] h-4 w-4"
                    />
                  </div>
                  {showPurohitCard && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#8A7A6E]">Purohit Service Description Override</label>
                      <textarea
                        placeholder="Description of the Purohit service..."
                        value={purohitServiceDescription}
                        onChange={(e) => setPurohitServiceDescription(e.target.value)}
                        rows={2}
                        className="w-full text-xs bg-white border border-[#EADFC9] rounded-lg px-3 py-1.5 focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* Custom Tap Circle Card */}
                <div className="space-y-4 border border-[#EADFC9] p-4 rounded-xl bg-white">
                  <div className="flex items-center justify-between border-b border-[#F2ECE4] pb-2">
                    <h4 className="font-serif font-bold text-sm text-[#3A332C]">3. Join Tapa Circle Card</h4>
                    <input
                      type="checkbox"
                      checked={showCircleCard}
                      onChange={(e) => setShowCircleCard(e.target.checked)}
                      className="rounded border-[#EADFC9] text-[#C82A54] focus:ring-[#C82A54] h-4 w-4"
                    />
                  </div>
                  {showCircleCard && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#8A7A6E]">Tapa Circle Description Override</label>
                      <textarea
                        placeholder="Description of the Tapa Circle..."
                        value={tapaCircleDescription}
                        onChange={(e) => setTapaCircleDescription(e.target.value)}
                        rows={2}
                        className="w-full text-xs bg-white border border-[#EADFC9] rounded-lg px-3 py-1.5 focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* --- Section: Panchang Details --- */}
            <div className="space-y-6 border-t border-[#F2ECE4] pt-8">
              <h3 className="font-serif font-bold text-lg border-b border-[#F2ECE4] pb-2 text-[#3A332C]">
                Panchang Calendar Alignments
              </h3>
              <p className="text-xs text-[#8A7A6E]">
                These values populate the Panchang Information box on the public detail page. If left blank, default placeholders will be shown.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Hero Subtitle Alignment (e.g. Ashwin Shukla Paksha · Delhi-NCR)</label>
                  <input
                    type="text"
                    placeholder="e.g. Ashwin Shukla Paksha · Delhi-NCR"
                    value={panchangAlignment}
                    onChange={(e) => setPanchangAlignment(e.target.value)}
                    className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#C82A54]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Observance Title (Card 1 Title)</label>
                  <input
                    type="text"
                    placeholder="e.g. Navratri 2026"
                    value={panchangObservance}
                    onChange={(e) => setPanchangObservance(e.target.value)}
                    className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#C82A54]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Observance Dates (Card 1 Sub)</label>
                  <input
                    type="text"
                    placeholder="e.g. 11–19 October"
                    value={panchangObservanceSub}
                    onChange={(e) => setPanchangObservanceSub(e.target.value)}
                    className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#C82A54]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Muhurta Title (Card 2 Title)</label>
                  <input
                    type="text"
                    placeholder="e.g. Ghatasthapana Preferred"
                    value={panchangMuhurta}
                    onChange={(e) => setPanchangMuhurta(e.target.value)}
                    className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#C82A54]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Muhurta Details (Card 2 Sub)</label>
                  <input
                    type="text"
                    placeholder="e.g. Sun 11 Oct · 6:19–10:12 AM"
                    value={panchangMuhurtaSub}
                    onChange={(e) => setPanchangMuhurtaSub(e.target.value)}
                    className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#C82A54]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Tithi Title (Card 3 Title)</label>
                  <input
                    type="text"
                    placeholder="e.g. Ashtami / Navami"
                    value={panchangTithi}
                    onChange={(e) => setPanchangTithi(e.target.value)}
                    className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#C82A54]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Tithi Details (Card 3 Sub)</label>
                  <input
                    type="text"
                    placeholder="e.g. 19 Oct — tithis merge"
                    value={panchangTithiSub}
                    onChange={(e) => setPanchangTithiSub(e.target.value)}
                    className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#C82A54]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Vijay Title (Card 4 Title)</label>
                  <input
                    type="text"
                    placeholder="e.g. Vijayadashami"
                    value={panchangVijay}
                    onChange={(e) => setPanchangVijay(e.target.value)}
                    className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#C82A54]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Vijay Details (Card 4 Sub)</label>
                  <input
                    type="text"
                    placeholder="e.g. Tue 20 Oct"
                    value={panchangVijaySub}
                    onChange={(e) => setPanchangVijaySub(e.target.value)}
                    className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-[#C82A54]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8A7A6E] uppercase tracking-wider">Panchang Observations / Notes</label>
                <textarea
                  placeholder="Enter any footnotes or regional variances regarding tithis or timings..."
                  value={panchangNote}
                  onChange={(e) => setPanchangNote(e.target.value)}
                  rows={4}
                  className="w-full text-sm bg-white border border-[#EADFC9] rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-[#C82A54]"
                />
              </div>
            </div>
          </div>
          </div>
          </div>
          </div>
          </div>
        )}

        {/* --- Tab: DPB Claims Wizard --- */}
        {activeTab === "dpb" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#F2ECE4] pb-2">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#3A332C]">DPB Claims Wizard</h3>
                <p className="text-[10px] text-[#8A7A6E] mt-0.5">
                  Verify Dharma facts, define Pratha variances, or document Bhranti myths requiring Founder Review.
                </p>
              </div>
              <button
                type="button"
                onClick={addDpb}
                className="flex items-center gap-1 bg-[#FDFBF7] border border-[#EADFC9] text-[#6A5A4E] hover:bg-[#F9F5EC] text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
              >
                <Plus size={12} />
                <span>Add DPB Element</span>
              </button>
            </div>

            {dpbEntries.length === 0 ? (
              <div className="text-sm text-[#8A7A6E] p-12 border-2 border-dashed border-[#EADFC9] rounded-2xl text-center">
                No DPB elements added. Click &quot;Add DPB Element&quot; to open the tag scorer wizard.
              </div>
            ) : (
              <div className="space-y-6">
                {dpbEntries.map((dpb, idx) => (
                  <div key={idx} className="border border-[#EADFC9] rounded-2xl p-5 bg-[#FDFBF7]/35 relative space-y-4 shadow-sm">
                    <button
                      type="button"
                      onClick={() => removeDpb(idx)}
                      className="absolute top-4 right-4 text-[#8A7A6E] hover:text-[#C82A54]"
                    >
                      <Trash2 size={16} />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Element Name */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#8A7A6E] uppercase">Element / Practice Name *</label>
                        <input
                          type="text"
                          placeholder="e.g. Coconut Placement"
                          value={dpb.elementName}
                          onChange={(e) => updateDpb(idx, { elementName: e.target.value })}
                          className="w-full text-xs bg-white border border-[#EADFC9] rounded-lg px-2.5 py-1.5 focus:outline-none"
                        />
                      </div>

                      {/* DPB Tag */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#8A7A6E] uppercase">Tag Classification *</label>
                        <select
                          value={dpb.tag}
                          onChange={(e) => updateDpb(idx, { tag: e.target.value as "DHARMA" | "PRATHA" | "BHRANTI" })}
                          className="w-full text-xs bg-white border border-[#EADFC9] rounded-lg px-2.5 py-1.5 focus:outline-none"
                        >
                          <option value="DHARMA">DHARMA (Truth)</option>
                          <option value="PRATHA">PRATHA (Regional Custom)</option>
                          <option value="BHRANTI">BHRANTI (Myth/Misconception)</option>
                        </select>
                      </div>

                      {/* Confidence Score */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#8A7A6E] uppercase">Confidence Score (0-5)</label>
                        <input
                          type="number"
                          min={0}
                          max={5}
                          value={dpb.confidenceScore}
                          onChange={(e) => updateDpb(idx, { confidenceScore: parseInt(e.target.value) || 0 })}
                          className="w-full text-xs bg-white border border-[#EADFC9] rounded-lg px-2.5 py-1.5 focus:outline-none disabled:bg-gray-100"
                          disabled={dpb.tag === "BHRANTI"} // Bhranti automatically locked to score 0
                        />
                      </div>
                    </div>

                    {/* Show myth/claim for PRATHA or BHRANTI */}
                    {(dpb.tag === "BHRANTI" || dpb.tag === "PRATHA") && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#8A7A6E] uppercase">Claim / Popular Belief *</label>
                        <textarea
                          placeholder="Describe the claim or popular belief..."
                          value={dpb.claim}
                          onChange={(e) => updateDpb(idx, { claim: e.target.value })}
                          rows={2}
                          className="w-full text-xs bg-white border border-[#EADFC9] rounded-lg p-2.5 focus:outline-none"
                        />
                      </div>
                    )}

                    {/* Correction / Fact */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#8A7A6E] uppercase">Scriptural Correction / Fact *</label>
                      <textarea
                        placeholder="State the correct scriptural fact or explanation..."
                        value={dpb.correction}
                        onChange={(e) => updateDpb(idx, { correction: e.target.value })}
                        rows={2}
                        className="w-full text-xs bg-white border border-[#EADFC9] rounded-lg p-2.5 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Source of truth citation text */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#8A7A6E] uppercase">Scriptural Citation Sources</label>
                        <input
                          type="text"
                          placeholder="e.g. Shiva Purana Ch 4 Verse 9"
                          value={dpb.sourceOfTruth}
                          onChange={(e) => updateDpb(idx, { sourceOfTruth: e.target.value })}
                          className="w-full text-xs bg-white border border-[#EADFC9] rounded-lg px-2.5 py-1.5 focus:outline-none"
                        />
                      </div>

                      {/* Regional Variance */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#8A7A6E] uppercase">Regional Custom Variances</label>
                        <input
                          type="text"
                          placeholder="e.g. East Indian households place mango leaves differently..."
                          value={dpb.regionalVariance}
                          onChange={(e) => updateDpb(idx, { regionalVariance: e.target.value })}
                          className="w-full text-xs bg-white border border-[#EADFC9] rounded-lg px-2.5 py-1.5 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Moderation Warning */}
                    {dpb.tag === "BHRANTI" && (
                      <div className="text-[10px] font-bold text-[#C82A54] bg-[#FFEAEF] px-3 py-2 rounded-xl flex items-center gap-2">
                        <Info size={14} />
                        <span>This BHRANTI entry will default to PENDING_FOUNDER_REVIEW and populate the dashboard review queue upon saving.</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- Tab 6: Sources & FAQs Linkages --- */}
        {activeTab === "relations" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sources checklist */}
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg border-b border-[#F2ECE4] pb-2 text-[#3A332C]">
                Link Scriptural Sources
              </h3>
              
              {allSources.length === 0 ? (
                <p className="text-xs text-[#8A7A6E] italic">No sources created in Library. Save guide and visit Sources tab first.</p>
              ) : (
                <div className="space-y-2 border border-[#EADFC9] rounded-2xl p-4 max-h-[300px] overflow-y-auto">
                  {allSources.map((source) => (
                    <label
                      key={source.id}
                      className="flex items-start gap-3 p-2 hover:bg-[#FDFBF7] rounded-xl cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSources.includes(source.id)}
                        onChange={() => handleToggleSource(source.id)}
                        className="rounded border-[#EADFC9] text-[#C82A54] focus:ring-[#C82A54] h-4 w-4 mt-0.5"
                      />
                      <div>
                        <div className="text-xs font-bold text-[#3A332C]">{source.name}</div>
                        <div className="text-[10px] text-[#8A7A6E] italic">{source.reference}</div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Reusable FAQs checklist & ordering */}
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg border-b border-[#F2ECE4] pb-2 text-[#3A332C]">
                Link and Order FAQs
              </h3>

              {allFaqs.length === 0 ? (
                <p className="text-xs text-[#8A7A6E] italic">No FAQs created in Library. Visit FAQs tab first.</p>
              ) : (
                <div className="space-y-4">
                  {/* Select FAQ checklist */}
                  <div className="space-y-2 border border-[#EADFC9] rounded-2xl p-4 max-h-[200px] overflow-y-auto">
                    {allFaqs.map((faq) => {
                      const isChecked = selectedFaqs.some((f) => f.faqId === faq.id);
                      return (
                        <label
                          key={faq.id}
                          className="flex items-center gap-3 p-1.5 hover:bg-[#FDFBF7] rounded-xl cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleFaq(faq)}
                            className="rounded border-[#EADFC9] text-[#C82A54] focus:ring-[#C82A54] h-4 w-4"
                          />
                          <span className="text-xs text-[#3A332C] truncate font-medium">{faq.question}</span>
                        </label>
                      );
                    })}
                  </div>

                  {/* Ordering lists */}
                  {selectedFaqs.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-bold text-[#8A7A6E] tracking-wider">Arrange Attached FAQs Order</span>
                      <div className="space-y-1.5">
                        {selectedFaqs.map((item, idx) => (
                          <div key={item.faqId} className="flex items-center justify-between bg-[#FDFBF7]/50 border border-[#EADFC9] p-2.5 rounded-xl text-xs font-semibold">
                            <span className="truncate max-w-[200px]">{item.question}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-[#8A7A6E]">Pos: {item.order}</span>
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => moveFaq(idx, "up")}
                                className="p-1 hover:bg-white text-[#8A7A6E] disabled:opacity-30 rounded"
                              >
                                <ArrowUp size={12} />
                              </button>
                              <button
                                type="button"
                                disabled={idx === selectedFaqs.length - 1}
                                onClick={() => moveFaq(idx, "down")}
                                className="p-1 hover:bg-white text-[#8A7A6E] disabled:opacity-30 rounded"
                              >
                                <ArrowDown size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}


      </div>
    </div>
  );
}
