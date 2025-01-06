import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Save } from 'lucide-react';

const SettingsPage = () => {
  // State management
  const [selectedLLMs, setSelectedLLMs] = useState<string[]>([]);
  const [cloudProvider, setCloudProvider] = useState("gcp");
  const [toolingName, setToolingName] = useState("");
  const [metadata, setMetadata] = useState<Array<{ key: string; value: string }>>([]);
  const [selectedModel, setSelectedModel] = useState("");

  // Handle adding new metadata
  const addMetadata = () => {
    setMetadata([...metadata, { key: "", value: "" }]);
  };

  // Handle metadata changes
  const updateMetadata = (index: number, field: 'key' | 'value', value: string) => {
    const newMetadata = [...metadata];
    newMetadata[index][field] = value;
    setMetadata(newMetadata);
  };

  // Handle form submission
  const handleSave = () => {
    console.log({
      selectedLLMs,
      cloudProvider,
      toolingName,
      metadata,
      selectedModel
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>
            Configure your LLM and cloud provider settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* LLM Selection */}
          <div className="space-y-4">
            <Label>LLM Selection</Label>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="gemini" 
                  checked={selectedLLMs.includes('gemini')}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedLLMs([...selectedLLMs, 'gemini']);
                    } else {
                      setSelectedLLMs(selectedLLMs.filter(llm => llm !== 'gemini'));
                    }
                  }}
                />
                <Label htmlFor="gemini">Gemini</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="gcp" 
                  checked={selectedLLMs.includes('gcp')}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedLLMs([...selectedLLMs, 'gcp']);
                    } else {
                      setSelectedLLMs(selectedLLMs.filter(llm => llm !== 'gcp'));
                    }
                  }}
                />
                <Label htmlFor="gcp">Chat GPT</Label>
              </div>
            </div>
          </div>

          {/* Cloud Provider Selection */}
          <div className="space-y-4">
            <Label>Cloud Provider</Label>
            <RadioGroup
              value={cloudProvider}
              onValueChange={setCloudProvider}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="gcp" id="gcp-radio" />
                <Label htmlFor="gcp-radio">GCP</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="azure" id="azure-radio" />
                <Label htmlFor="azure-radio">Azure</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Model Selection */}
          <div className="space-y-4">
            <Label>Model Selection</Label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger>
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                <SelectItem value="claude">Claude</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tooling Section */}
          <div className="space-y-4">
            <Label>Tooling Configuration</Label>
            <div className="flex gap-4">
              <Input
                placeholder="Tooling Name"
                value={toolingName}
                onChange={(e) => setToolingName(e.target.value)}
              />
              <Button variant="outline" onClick={addMetadata}>
                <Plus className="w-4 h-4 mr-2" />
                Add Metadata
              </Button>
            </div>

            {/* Metadata Table using basic table with Tailwind */}
            {metadata.length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Key</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {metadata.map((item, index) => (
                      <tr key={index} className="bg-white">
                        <td className="px-4 py-2">
                          <Input
                            value={item.key}
                            onChange={(e) => updateMetadata(index, 'key', e.target.value)}
                            placeholder="Key"
                            className="w-full"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <Input
                            value={item.value}
                            onChange={(e) => updateMetadata(index, 'value', e.target.value)}
                            placeholder="Value"
                            className="w-full"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Save Button */}
          <Button onClick={handleSave} className="w-full">
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;